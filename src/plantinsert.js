const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/LoginFormPractice")
.then(()=>{
    console.log('mongoose connected.');
})
.catch((e)=>{
    console.log('failed');
})

const insertSchema=new mongoose.Schema({

    plantName:{
        type:String,
        required:true
    },
    BName:{
        type:String,
        required:true
    },
    plantPrice:{
        type:Number,
        required:true
    }
})

const collection=new mongoose.model('collection',insertSchema)

module.exports=collection;
