const dependable = require('dependable');
const path = require('path');

const container = dependable.container();

const simpleDependencies = [
    ['_', 'lodash'],
    ['passport','passport'],
    ['formidable','formidable'],
    ['async','async'],
    ['Group','./models/group'],
    ['Users','./models/user'],
    ['aws', './helpers/aws']
   
];

simpleDependencies.forEach(function(val){
    container.register(val[0], function(){
        return require(val[1]);
    })
});

container.load(path.join(__dirname,'/controllers'));
container.load(path.join(__dirname,'/helpers'));

container.register('container', function(){
    return container;
})

module.exports = container;