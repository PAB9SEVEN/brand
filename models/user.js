var mongoose=require('mongoose');
var passportLocalMongoose=require('passport-local-mongoose');
var userSchema=new mongoose.Schema({
    fname:String,
    username:{
        type:String,
        unique:true
    },
    password:String,
    mobile:Number,
    role:String
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);