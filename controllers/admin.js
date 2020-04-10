module.exports = function(formidable, Group, aws, async, Users){
    return {
        SetRouting: function(router){
            //GET Route
            router.get('/admin/dashboard', this.adminPage);
            router.get('/admin/dashboard/2', this.adminPage2);
            router.get('/admin/remove-group', this.getRemoveGroup);

            //POST Route
            router.post('/uploadFile', aws.Upload.any(), this.uploadFile);

            router.post('/dashboard', this.adminPostPage);
        },

        adminPage: function(req,res){
            res.render('admin/dashboard', {
                user: req.user
            });
        },

        adminPage2: (req,res) => {
            res.render('admin/dashboard-2', {
                user: req.user
            });
        },

        adminPostPage: function(req,res){
            const newGroup = new Group();
            newGroup.name = req.body.group;
            newGroup.tagline = req.body.tagline;
            newGroup.image = req.body.upload;
            newGroup.save((err) => {
                res.render('admin/dashboard')
            });
        },

        uploadFile: function(req,res){
            const form = new formidable.IncomingForm();
            //form.uploadDir = path.join(__dirname, '../public/uploads');

            form.on('file', (field, file) => {
                // fs.rename(file.path, path.join(form.uploadDir, file.name),(err) => {
                //     if(err) throw err;
                //     console.log('File Renamed Successfully');
                // })
            });
            form.on('error', (err) => {
                console.log(err)
            });

            form.on('end',() => {
                console.log('File Uploaded Successfully')
            });

            form.parse(req);
        },

        getRemoveGroup: (req,res) => {
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
            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                const res3 = results[2];
                const dataChunk = [];
                const chunkSize = 4; //to determine number of group results to be displayed in a row
                for (let i = 0; i < res1.length; i+=chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }

                res.render('admin/remove-group', {
                    user: req.user,
                    chunks: dataChunk,
                    data: res2,
                    chat: res3
                });
            })
        }
    }
}