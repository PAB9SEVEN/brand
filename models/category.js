var mongoose=require('mongoose');
var categorySchema=new mongoose.Schema({
  category:String,
    questions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question"
    }]
});
module.exports=mongoose.model("Category",categorySchema);