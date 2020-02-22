module.exports = function(async, Group){
    return {
        SetRouting: function(router){
            router.get('/searchresult', this.getSearchResults);

            router.post('/searchresult', this.postSearchResults);
        },

        getSearchResults: (req,res) => {
            res.render('searchresult', {
                user: req.user
            })   
        },
        postSearchResults: (req,res) => {
            async.parallel([
                function(callback){
                    const regex = new RegExp((req.body.tagline), 'gi');
                    
                    Group.find({'$or': [{'tagline':regex}, {'name': regex}]}, (err, result) => {
                       callback(err, result); 
                    });
                }
            ], (err, results) => {
                const res1 = results[0];
                
                const dataChunk  = [];
                const chunkSize = 3;
                for (let i = 0; i < res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i, i+chunkSize));
                }
                
                res.render('searchresult', {
                    user: req.user, chunks: dataChunk
                });
            })
        }
    }
}