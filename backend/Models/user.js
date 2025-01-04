const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
    userId: {
        type:String ,
    } ,
    isAdmin:{
        type:Boolean,
        default:false
    }
    }
)

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
