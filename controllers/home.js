module.exports = function(async, Group, _, Users){
    return {
        SetRouting: function(router){
            router.get('/home', this.homePage);

            router.post('/home', this.postHomePage)
        },
        homePage: function(req,res){
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
                }
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const dataChunk = [];
                const chunkSize = 4; //to determine number of group results to be displayed in a row
                for (let i = 0; i < res1.length; i+=chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }

                res.render('home', {
                    chunks: dataChunk,
                    user: req.user,
                    data: res2
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
                }
            ], (err, results) => {
                res.redirect('/home');
            });
        }
       
    }
}