const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            default: null
          },
        photoUrl: {
            type: String
          },
        comment:{
            type: String
        },
        longitude:{
            type: String
        },
        latitude:{
            type: String
        }
    }
)
const photoModel = mongoose.model("photo", photoSchema);
module.exports = photoModel;