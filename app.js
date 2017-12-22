var express=require('express');
var exphbs=require('express-handlebars');
var port=3000;
var path=require('path');
var session=require('express-session');
var expressValidator=require('express-validator');
var bodyParser=require('body-parser');
var methodOverride=require('method-override');
var mongoose=require('mongoose');
//mongoose.connect('mongodb://localhost/newpro');
//var db=mongoose.connection;
mongoose.connect('mongodb://brand:brand@ds157248.mlab.com:57248/brand')

var passport=require('passport');
var localStrategy=require('passport-local');
var flash=require('connect-flash');
var index=require('./routes/index');
var users=require('./routes/users');
var admin=require('./routes/admin');
var User=require('./models/user');
var app=express();
app.use(flash());
app.use(require('express-session')({
    secret:"cats",
    resave:false,
    saveUninitialized:false
}));
app.use(methodOverride('_method'));
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
var expressSanitizer=require('express-sanitizer');
app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');
    app.set('partials',path.join(__dirname + '/views','partials'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy( User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(expressSanitizer());
    app.use(express.static(path.join(__dirname,'public')));
    app.use('/static', express.static(__dirname + '/public'));
app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
});
app.use('/',index);
app.use('/users',users);
app.use('/admin',admin);
app.set('port',process.env.PORT||3000);
app.listen(app.get('port'),function(){
    console.log("server started on "+app.get('port'));
});
