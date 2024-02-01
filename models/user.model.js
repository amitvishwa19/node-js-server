const mongoose = require('mongoose')


const userModel = new mongoose.Schema(
  {
    uid:String,
    username: {
      type: String, 
      default: null,
    },
    displayName: {
      type: String, 
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    photoURL: {
      type: String, 
      default: null,
    },
    password: String,
    emailVerified: {
      type: Boolean,
      required: false,
      default: false
    },
    bio:{
      type: String, 
      default: null,
    },
    loginType:String,
    provider:String,
    mobileDeviceToken: String,
    webDeviceToken: String,
    refreshToken: String,
    accessToken: String,
    accessTokenExpiry: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    chats: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
      default: [],
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userModel);
module.exports = User;