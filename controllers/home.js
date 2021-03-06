module.exports = function(async, Group, _, Users, Message, FriendResult, auth){
    return {
        SetRouting: function(router){
            router.get('/home', auth.requireLogin, this.homePage);

            router.post('/home', auth.requireLogin, this.postHomePage)

            router.get('/logout', this.logout);
        },
        homePage:  (req,res) => {
            async.parallel([
                function(callback){
                    Group.find({}, (err, result) => {
                        callback(err, result);
                    })
                },
                function(callback){
                    Users.findOne({'username': req.user.username})
                    .populate('request.userId')
                    .exec((err, result) => {
                        callback(err, result);
                    })
                },
                function(callback){
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
                    Message.aggregate(
                        [{ $match: {$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                        { $sort: {"createdAt":-1}},
                        { $group: {"_id":{
                                "last_message_between":{ $cond:[
                                        {$gt:[
                                         {$substr:["$senderName",0,1]},
                                         {$substr:["$receiverName",0,1]}]
                                        },
                                        {$concat:["$senderName"," and ","$receiverName"]},
                                        {$concat:["$receiverName"," and ","$senderName"]}
                                    ]
                                }
                                }, "body": {$first:"$$ROOT"}
                            }
                        }], 
                        function(err, newResult){
                            // console.log(newResult)
                            const arr = [
                                {path: 'body.sender', model: 'User'},
                                {path: 'body.receiver', model: 'User'}
                            ];

                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult1);
                            })
                        }
            )
                },
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                const dataChunk = [];
                const chunkSize = 4; //to determine number of group results to be displayed in a row
                for (let i = 0; i < res1.length; i+=chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }

                res.render('home', {
                    user: req.user,
                    chunks: dataChunk,
                    data: res2,
                    chat: res3
                });
            })
            
        },

        postHomePage: (req,res) => {
            async.parallel([
                function(callback){
                    Group.update({
                        '_id': req.body.id,
                        'followers.username': {$ne: req.user.username}
                    }, {
                        $push: {followers: {
                            username: req.user.username,
                            email: req.user.email
                        }}
                    }, (err,count) => {
                        console.log(count);
                        callback(err, count);
                    })
                },
                
            ], (err, results) => {
                res.redirect('/home');
            });

            FriendResult.PostRequest(req, res, '/home');
        },

        logout: (req,res) => {
            req.logout();
            req.session.destroy((err)=> {
                res.redirect('/');
            });
        }
       
    }
}