var express=require('express');
var router=express.Router();
var passport=require('passport');
var User=require('../models/user');
var Category=require('../models/category');
var Detail=require('../models/detail');
var Question=require('../models/question');
var Comment=require('../models/comments');
var flash=require('connect-flash');
var passportLocalMongoose=require('passport-local-mongoose');
var expressValidator=require('express-validator');

router.get('/',function(req,res){
    res.render('index');
});
//AUTH ROUTES===
//router.get('/userconsole',isloggedin,isUser,function(req,res){
router.get('/userconsole',isloggedin,isUser,function(req,res){
    Question.find(req.params.id).populate("details").populate("comments").exec(function(err,data){
    
        if(err){
            console.log(err);
        }
        else{
         //   console.log(req.user.username);
       // console.log(data[i].details.email);
            for(var i=0;i<data.length;i++)
                {
                    //console.log(data[i].details.email);
                    //console.log("******************");
                    //console.log(req.user.username);
            if(req.user.username == data[i].details.email)
                
                {
                   data[i].isTrue = true;
                    //res.render('userconsole',{data:data});
                    //console.log("passed");
                }
            else{
data[i].isTrue=false;
                //console.log("not passed");
            }
                }
            // console.log(data[0].details.email);
            //console.log(occupied);
    res.render('userconsole',{data:data});        
        }
    });
    
});
router.get('/userconsole/:id/newcomment',isloggedin,isUser,function(req,res){
    Question.findById(req.params.id,function(err,data){
        if(err){
            console.log(err);
            req.flash('error',err);
        }
        else{
            res.render('new_comment',{data:data});
            console.log(data);
        }
    });
});
router.post('/userconsole/:id/submit',isloggedin,isUser,function(req,res){
    Question.findById(req.params.id,function(err,question){
        if(err)
            {
                res.redirect("back");
            }
        else{
   //var checklist=req.body.checklist;
    var comments=req.body.comments;
            var isDone=req.body.isDone;
    var data={
       comments:comments
    }
    //console.log(data);
    Comment.create(data,function(err,comm){
        if(err){
            console.log(err);
            req.flash('error',err);
        }
        else{
            comm.save();
            question.comments.push(comm);
            question.save();
            console.log("&&&&&&&&&&&&&&&&&&&&&");
            console.log(comm);
            console.log("*********************");
            console.log(question);
            res.redirect('/userconsole');
        }
        console.log(comm);
    });
              
        }
    });
  /*
    var check;
if(checklist === "on")
    {
     check=true;
    }
    else{
    check=false;    
    }
    */
    //res.render('userconsole',{check:check});
});
router.get('/login',function(req,res){
    res.render('login');
});
router.get('/register',function(req,res){
    res.render('register');
});
router.post('/register',function(req,res)
{
var username=req.body.username;
var password=req.body.password;
var mobile=req.body.mobile;
var fname=req.body.fname;
var role=req.body.role;
req.checkBody('password',"password is required").notEmpty();
req.checkBody('fname',"Company name is required").notEmpty();
req.checkBody('role',"Role is required").notEmpty();
req.checkBody('username',"Email is required").notEmpty();
//req.checkBody('email',"Email is required").notEmpty();
    var errors=req.validationErrors();
    if(errors)
        {
            res.render('register',{errors:errors});
        }
    else{
 User.register({username:req.body.username,role:req.body.role,fname:req.body.fname,mobile:req.body.mobile},req.body.password,function(err,user){
        if(err){
            console.log(err);
            req.flash('error',err.message);
           return res.redirect('/register');
        }
        else{
                passport.authenticate("local")(req,res,function(){
                    if(role === "Admin")
                    {
console.log("this is the admin");
                    req.flash('success',"You have successfully registered "+user.fname+"!");
                res.redirect('/category');
                }
                    else{
                        console.log("this is the user");
            req.flash('success',"You have successfully registered "+user.fname+"!");
                res.redirect('/userconsole');

                    }});
        }
    });

    console.log(username);
    console.log(password);
    console.log(role);
    console.log(mobile);
    console.log(fname);
}
});
router.post('/login',passport.authenticate("local",{
    successRedirect:'/next',
    failureRedirect:'/login'
}),function(req,res){
    if(req.user.role === 'Admin')
        {
req.flash('success',"Logged you in");
res.redirect('/category');
        }
    else if(req.user.role === "User"){
        req.flash('success','Logged you in');
        res.redirect('/userconsole');
    }
    else{
        req.flash("error",'There is some problem from your end');
        res.redirect('/login');
    }
});
router.get('/logout',function(req,res){
    req.logout();
        req.flash('success',"Logged you out");
    res.redirect('/next');
});
router.get('/next',function(req,res){
    res.render('next');
});
router.get('/category',isloggedin,isAdmin,function(req,res){
Category.find({},function(err,found){
    if(err){
        req.flash('error',err.msg);
        console.log(err);
    }
    else{
        res.render('category',{found:found});
    }
});
});
router.get('/category/new',isloggedin,isAdmin,function(req,res){
    res.render('new');
});
router.post('/category/new',isloggedin,isAdmin,function(req,res){
var category=req.body.category;
    console.log(category);
    newcategory={category:category}
    Category.create(newcategory,function(err,category){
        if(err)
            {
            console.log(err);
req.flash('error',err.msg);
            }
        else{
            res.redirect('/category');
        }
    });
});
router.get('/category/:id/questions/new',isloggedin,isAdmin,function(req,res){
Category.findById(req.params.id,function(err,data){
    if(err)
        {
            req.flash('error',err);
            console.log(err);
        }
    else{
        res.render('newquestions',{data:data});
    }
});
});
router.get('/category/:id/show',isloggedin,isAdmin,function(req,res){
    Category.findById(req.params.id).populate("questions").exec(function(err,data){
        if(err){
            console.log(err);
            req.flash('error',err);
        }
        else{
            //console.log(data.question);
            console.log(data);
            //res.render('show',{data:data});
        }
    });
    
});
router.get('/category/:id/showforms',isloggedin,isAdmin,function(req,res){
    Question.findById(req.params.id).populate("details").exec(function(err,data){
        if(err){
            console.log(err);
            req.flash('error',err);
        }
        else{
            //console.log(data.question);
            //console.log(data);
            res.render('show',{data:data});
            //console.log(data);
            console.log(data.question);
            console.log(data.details);
        }
    });
    
});
router.post('/category/:id/questions/new',isloggedin,isAdmin,function(req,res){
    Category.findById(req.params.id,function(err,data){
        if(err)
            {
                console.log(err);
                req.flash('error',err);
            }
        else{
  var question=req.body.question;
    var questions={
        question:question
        /*
     weightage:weightage,
stableClosure:stableClosure,
        satisfactory:satisfactory,
        openfindings:openfindings,
        score:score,
        subelement_score:subelement_score
        */
    }; 
            Question.create(questions,function(err,newque){
                if(err){
                    console.log(err);
                }
                else{
                    newque.save();
                    console.log(data.questions);
                    data.questions.push(newque);
                    data.save();
                    res.redirect('/category/'+req.params.id+'/showlist');
                    //res.render('showquestions');
                    
                }
            });
        }
    }); 
});
router.get('/category/:id/showlist',isloggedin,isAdmin,function(req,res){
    Category.findById(req.params.id).populate("questions").exec(function(err,data){
        if(err){
            console.log(err);
            req.flash('error',err);
        }
        else{
          console.log(data);
            res.render('showquestions',{data:data});
        }
    });
});
router.get('/category/:id/editforms',isloggedin,isAdmin,function(req,res){
    Question.findById(req.params.id).populate("details").exec(function(err,data){
    //Question.findById(req.params.id,function(err,data){
        if(err){
            console.log(err);
            req.flash('error',err);
        }
        else{
            console.log(data);
            res.render('editforms',{data:data});
        }
    });
});
router.put('/category/:id/editforms',isloggedin,isAdmin,function(req,res){
    var weightage=req.body.weightage;
    var stableClosure=req.body.stableClosure;
    var satisfactory=req.body.satisfactory;
    var openfindings=req.body.openfindings;
    var score=req.body.score;
    var subelement_score=req.body.subelement_score;
    var email=req.body.email;
        var updated={
                weightage:weightage,
                stableClosure:stableClosure,
                satisfactory:satisfactory,
                openfindings:openfindings,
                score:score,
                subelement_score:subelement_score,
                email:email
        }
        
    Detail.findByIdAndUpdate(req.params.id,updated,function(err,data){
        if(err){
            req.flash('error',err);
            console.log(err);
            res.redirect('/category/'+req.params.id+'/editforms');
        }
        else{
            console.log(data);
            res.redirect('/category');
        }
    });
                            
});
router.delete('/category/:id',isloggedin,isAdmin,function(req,res){
   Question.findByIdAndRemove(req.params.id,function(err,data){
      if(err) 
          {
res.redirect('/category');
          }
       else{
           res.redirect('/category');
       }
   });
});
router.post('/category/:id/show/details',isloggedin,isAdmin,function(req,res){
Question.findById(req.params.id,function(err,data){
    if(err){
        console.log(err);
        req.flash('error',err);
    }
    else{
        var weightage=req.body.weightage;
    var stableClosure=req.body.stableClosure;
    var satisfactory=req.body.satisfactory;
    var openfindings=req.body.openfindings;
    var score=req.body.score;
    var subelement_score=req.body.subelement_score;
        var email=req.body.email;
        var det={
                 weightage:weightage,
stableClosure:stableClosure,
        satisfactory:satisfactory,
        openfindings:openfindings,
        score:score,
        subelement_score:subelement_score,
            email:email
        }
        Detail.create(det,function(err,newdetail){
            if(err){
                req.flash('error',err);
                console.log(err);
            }
            else{
               newdetail.save();
                    //console.log(data.questions);
                    //data.details.push(newdetail);
                    data.details=newdetail;
                    data.save();
                console.log(data);
                    res.redirect('/category');
                
            }
        });
    }
});
});
function isloggedin(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.flash('error',"You must first login");
        res.redirect('/login');
    }
}
function isAdmin(req,res,next){
    if(req.user.role === 'Admin')
        {
        next();
        }
    else{
        req.flash('error','You are not authorised!');
        res.redirect('/next');
    }
}
function isUser(req,res,next){
    if(req.user.role === 'User')
        {
        next();
        }
    else{
        req.flash('error','You are not authorised!');
        res.redirect('/next');
    }
}
module.exports=router;