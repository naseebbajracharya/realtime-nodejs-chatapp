//Load Modules
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const socketIO = require('socket.io');

//Loading Keys
const Keys = require('./secret/secret');

const {Users} = require('./helpers/UsersClass')
const {Global} = require('./helpers/Global');

const container = require('./container');

container.resolve(function(users, _, admin, home, group, searchresult, privatechat){
    //MongoDB Connections
    mongoose.Promise = global.Promise;
    mongoose.connect(Keys.MongoDB,
        { useUnifiedTopology: true, 
        useNewUrlParser: true })
        .then(() => {
            console.log('Server is connected to MongoDB')
        })

    const app = SetupExpress();

    function SetupExpress(){
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server);

        //Declaring port number and listening
        const port = 3000;
        server.listen(port, function(){
            console.log('Running on port '+ port);
        });
        ConfigureExpress(app);
        
        //using socket IO inside gc.js
        require('./socketIO/gc')(io, Users);
        require('./socketIO/friend')(io);
        require('./socketIO/globalroom')(io, Global, _);
        require('./socketIO/pvtmsg')(io);

        //Setting up express router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        group.SetRouting(router);
        searchresult.SetRouting(router);
        privatechat.SetRouting(router);
        
        app.use(router);
    }

    function ConfigureExpress(app){
        require('./passport/passport-local');
        
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(validator());
        app.use(session({
            secret: Keys.secret,
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));

        app.use(flash());
        //Local Passport
        app.use(passport.initialize());
        app.use(passport.session());

        //Setting local variables
        app.locals._ = _;
    }
});