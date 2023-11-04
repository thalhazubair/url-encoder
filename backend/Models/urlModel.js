import mongoose from "mongoose"

const UrlSchema = new mongoose.Schema({
   
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String
    },
    shortUrl:{
        type:String
    },
    longUrl:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
   
})

const UrlModel=mongoose.model("Url", UrlSchema)
export default UrlModel