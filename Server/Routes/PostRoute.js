import express from "express"
import { CreatePost, deletePost, getPost, getTimelinePosts, likePost, updatePost } from "../Controller/PostController.js"



const router = express.Router()

router.post("/",CreatePost)
router.get("/:id", getPost)
router.put("/:id", updatePost)
router.delete("/:id",deletePost)
router.put("/:id/like", likePost)
router.get("/:id/timeline", getTimelinePosts)
export default router 
