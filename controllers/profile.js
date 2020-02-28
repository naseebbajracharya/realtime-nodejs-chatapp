module.exports = function(async, Users, Message, aws, formidable, FriendResult){
    return {
        SetRouting: function(router){
            router.get('/set/profile', this.getMyProfile);
            router.get('/set/my-profile/:name', this.viewProfile);
            router.get('/set/settings', this.profileSetting);

            router.post('/userupload', aws.Upload.any(), this.postUserPhoto);
            router.post('/set/profile', this.postMyProfile);
            router.post('/set/my-profile/:name', this.viewProfilePage);
            router.post('/settings/deactivate-account', this.deactivateAccount);
        },

        getMyProfile: (req,res) => {
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
                            callback(err, newResult);
                        }
                    )
                }
            
            ], (err,results) => {
                const result1 = results[0];
                const result2 = results[1];
                res.render('user/profile', {
                    user:req.user,
                    data: result1,
                    chat: result2,
                });
            });
        },


        postMyProfile: (req,res) => {
            FriendResult.PostRequest(req, res, 'set/profile');

            async.waterfall([
                function(callback){
                    Users.findOne({'_id':req.user._id}, (err, result) => {
                        callback(err, result);
                    })
                },

                function(result, callback){
                    if (req.body.upload === null || req.body.upload === '') {
                        Users.update({
                            '_id':req.user._id
                        },
                        {
                            username: req.body.username,
                            fullname: req.body.fullname,
                            country: req.body.country,
                            gender: req.body.gender,
                            cnumber: req.body.cnumber,
                            twitter: req.body.twitter,
                            github: req.body.github,
                            bio: req.body.bio,
                            userImage: result.userImage
                        },
                        {
                            upsert: true
                        }, (err, result) => {
                            console.log(result);
                            res.redirect('/set/profile');
                        })
                    } else if(req.body.upload !== null || req.body.upload !== ''){
                        Users.update({
                            '_id':req.user._id
                        },
                        {
                            username: req.body.username,
                            fullname: req.body.fullname,
                            country: req.body.country,
                            gender: req.body.gender,
                            cnumber: req.body.cnumber,
                            twitter: req.body.twitter,
                            github: req.body.github,
                            bio: req.body.bio,
                            userImage: req.body.upload
                        },
                        {
                            upsert: true
                        }, (err, result) => {
                            console.log(result);
                            res.redirect('/set/profile');
                        })
                    }
                }

            ])
        },

        postUserPhoto: (req,res) => {
            const form = new formidable.IncomingForm();
            form.on('file', (field, file) => {

            });

            form.on('error', (err) => {

            });

            form.on('end', () => {

            });

            form.parse(req);
        },

        viewProfile: (req,res) => {
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
                            const arr = [
                                {path: 'body.sender', model: 'User'},
                                {path: 'body.receiver', model: 'User'}
                            ];

                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult1);
                            })
                        }
                    )
                }
            
            ], (err,results) => {
                const result1 = results[0];
                const result2 = results[1];
                res.render('user/overview', {
                    user:req.user,
                    data: result1,
                    chat: result2,
                });
            });
        },

        viewProfilePage: (req,res) => {
            FriendResult.PostRequest(req, res, 'set/profile/'+req.params.name);
        },

        profileSetting: (req,res) => {
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
                            const arr = [
                                {path: 'body.sender', model: 'User'},
                                {path: 'body.receiver', model: 'User'}
                            ];

                            Message.populate(newResult, arr, (err, newResult1) => {
                                callback(err, newResult1);
                            })
                        }
                    )
                }
            
            ], (err,results) => {
                const result1 = results[0];
                const result2 = results[1];
                res.render('user/settings', {
                    user:req.user,
                    data: result1,
                    chat: result2,
                });
            });
        },

        deactivateAccount: (req,res) => {
            Users.deleteOne({_id:req.user._id})
            .then(() => {
                res.redirect('/');
            }).catch((err) => {
                console.log(err);
            })
        }

    }
}