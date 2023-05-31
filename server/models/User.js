import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      max: 50,
    },
    email: {
      type: String,
      max: 50,
    },
    password: {
      type: String,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;