import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId:String,
    uploadedImages: Buffer,
  },
  { timestamps: true }
);

const Posts = mongoose.model("posts", PostSchema);
export default Posts;