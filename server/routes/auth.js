import express from "express";
import multer from "multer"
const upload = multer();
import { login, register,getDataById,postImage ,getPostsById} from "../controllers/auth.js";

const router = express.Router();


router.post('/register',register)
router.post("/login", login);
router.get("/:id",getDataById)
router.get("/posts/:id",getPostsById)


router.get('/login', (req,res)=>{
    res.status(201).json({message:"hello jay"})
    console.log("hello get");
})

router.post('/uploads',upload.single('image'),postImage )

export default router;