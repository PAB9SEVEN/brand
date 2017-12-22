var mongoose=require('mongoose');
var commentSchema=new mongoose.Schema({
    comments:String
});
module.exports=mongoose.model("Comment",commentSchema);