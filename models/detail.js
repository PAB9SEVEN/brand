var mongoose=require('mongoose');
var detailSchema=new mongoose.Schema({
    //question:String,
    weightage:Number,
    stableClosure:Number,
satisfactory:Number,
    openfindings:Number,
    score:Number,
    subelement_score:Number,
  email:String
});
module.exports=mongoose.model("Detail",detailSchema);