module.exports = function(formidable, Group, aws){
    return {
        SetRouting: function(router){
            //GET Route
            router.get('/admin/dashboard', this.adminPage);
            router.get('/admin/dashboard/2', this.adminPage2);

            //POST Route
            router.post('/uploadFile', aws.Upload.any(), this.uploadFile);

            router.post('/dashboard', this.adminPostPage);
        },

        adminPage: function(req,res){
            res.render('admin/dashboard');
        },

        adminPage2: (req,res) => {
            res.render('admin/dashboard-2');
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
        }
    }
}