import mongoose from "mongoose";

const collectionName = "Users";


const userShema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      username: {
        type: String,
        required: true,
        index:true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        index:true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
      role:{
          type:String,
          required:true,
          enum:["USER","ADMIN","PUBLIC","PREMIUM"],
          default:"USER",
      },
      documents: [
        {
            name: String,
            reference: String
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'active'],
        default: 'pending'
    },
    last_connection: {
        type: Date
    }
});
const userModel = mongoose.model(collectionName,userShema);
export default userModel;