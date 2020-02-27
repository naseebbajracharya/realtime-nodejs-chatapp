module.exports = function(Users, async, Message, FriendResult, GroupMg){
    return {
        SetRouting: function(router){
            //GET Route
            router.get('/group/:name', this.groupPage);
            router.get('/view-profile/:name', this.getVisitorProfile);

            //POST Route
            router.post('/group/:name', this.groupPostPage);
            router.get('/logout', this.logout);
        },
        groupPage: (req,res) => {
            const name = req.params.name;
            async.parallel([
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
                            // callback(err, newResult);
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

                function(callback){
                    GroupMg.find({})
                        .populate('sender')
                        .exec((err, result) => {
                            callback(err, result);
                        });
                }
            
            ], (err,results) => {
                const result1 = results[0];
                const result2 = results[1];
                const result3 = results[2];
                res.render('groupchat/group', {
                    user:req.user,
                    groupName:name,
                    data: result1,
                    chat: result2,
                    groupMsg: result3
                });
            });
        },

        //separated using helpers and passing URL
        groupPostPage: (req,res) => {
            FriendResult.PostRequest(req,res, '/group/'+req.params.name);

            async.parallel([
                function(callback){
                    if (req.body.message) {
                        const groupmg = new GroupMg();
                        groupmg.sender = req.user._id;
                        groupmg.body = req.body.message;
                        groupmg.name = req.body.groupName;
                        groupmg.createdAt = new Date();

                        groupmg.save((err, msg) => { //saving gc msg into mongo db
                            // console.log(msg);
                            callback(err, msg);
                        })
                    }
                }
            ], (err, results) => {
                res.redirect('/group/'+req.params.name);
            })
        },

        // groupPostPage: (req,res)=>{
        //     FriendResult.PostRequest(req,res, '/group/'+req.params.name);
        // },

        logout: (req,res) => {
            req.logout();
            req.session.destroy((err)=> {
                res.redirect('/');
            });
        },

        getVisitorProfile: (req,res) => {

            const name = req.params.name;
            async.parallel([
                function(callback){
                    Users.findOne({'username': req.params.name})
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
                            callback(err, newResult);
                        }
            )
                },

                function(callback){
                    GroupMg.find({})
                        .populate('sender')
                        .exec((err, result) => {
                            callback(err, result);
                        });
                }
            
            ], (err,results) => {
                const result1 = results[0];
                const result2 = results[1];
                const result3 = results[2];
                res.render('user/visitors-profile', {
                    user:req.user,
                    groupName:name,
                    data: result1,
                    chat: result2,
                    groupMsg: result3
                });
            });

            // res.render('user/visitors-profile', {
            //     user: req.user
            // });
        }
    }
}