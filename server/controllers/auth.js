import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Posts from "../models/Posts.js";

/* *****************************************    REGISTER USER   **************************************   */
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ message: "plz provide email and password" });
    }
    // encrypt the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: passwordHash,
    });
    // save the users registration data in database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*  ***************** LOGGING IN  ********************************************************  */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    // if user email is not present in databse then gives the 400
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    // checking the users password is equal to database password or not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    // generating the jwt tokans
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// getting data from id
export const getDataById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.find({ _id: { $in: userId } });
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const postImage = async (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const { userId } = req.body;
  const imageBuffer = req.file.buffer;
  // if (!req.file) {
  //   return res.status(400).send("No file uploaded.");
  // }
  try {
    
    const newUser = new Posts({
     userId,
     uploadedImages: imageBuffer,
    });
    // save the users registration data in database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// getting data from id
export const getPostsById = async (req, res) => {
  const userId = req.params.id;
  console.log(req.params.id);
  try {
    const user = await Posts.find({ userId});
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


