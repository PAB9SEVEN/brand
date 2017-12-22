var mongoose=require('mongoose');
var questionSchema=new mongoose.Schema({
    question:String,
    //weightage:Number,
    //stableClosure:Number,
//satisfactory:Number,
  //  openfindings:Number,
    //score:Number,
    //subelement_score:Number,
    //email:String
    details:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Detail"
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    isDone:Boolean,
    isTrue:Boolean
});
module.exports=mongoose.model("Question",questionSchema);