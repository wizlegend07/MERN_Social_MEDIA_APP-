import PostModel from './../models/postModel.js';
import UserModel from '../models/userModel.js';
import mongoose from "mongoose";

// create new Post 
export const CreatePost = async(req,res)=>{
    const newPost = new PostModel(req.body);
    try {
        await newPost.save()
        res.status(200).json("Post create!")
    } catch (error) {
        res.status(500).json(error)
    }
}

// Get a Post 
export const getPost=async(req,res)=>{
    const id = req.params.id
    try {
        const post = await PostModel.findById(id)
        res.status(200).json(post)
    } catch (error) {
         res.status(500).json(error);
    }
}

// update post 
export const updatePost = async(req,res)=>{
    const postId = req.params.id 
    const {userId} = req.body
    try {
        const post = await PostModel.findById(postId)
        if(post.userId ===userId){
        await post.updateOne({$set:req.body})
        res.status(200).json("post updated")
        }else{
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
         res.status(500).json(error);
    }
}

// delete post 
export const deletePost = async(req,res)=>{
    const postId = req.params.id 
    const {userId} = req.body
    try {
        const post = await PostModel.findById(postId)
        if(post.userId ===userId){
        await post.deleteOne()
        res.status(200).json("post deleted successfully!!")
        }else{
            res.status(403).json("Action forbidden")
        }
    } catch (error) {
         res.status(500).json(error);
    }
}

// like/dislike a post 
export const likePost =async (req,res)=>{
    const id = req.params.id
    const {userId}=req.body
    try {
        const post = await PostModel.findById(id)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push:{likes:userId}})
            res.status(200).json("post liked")
        }else{
            await post.updateOne({$pull:{likes:userId}})
            res.status(200).json("post unliked")
        }
    } catch (error) {
        res.status(500).json(error);
    }
}

// Get timeline Post 
export const getTimelinePosts=async(req,res)=>{
    const userId = req.body.id
    try {
        const currentUserPosts = await PostModel.find({userId:userId})
        const followingPosts=await UserModel.aggregate([
            {
                $match : new mongoose.Types.ObjectId(userId)

            },
            {
                $lookup:{
                    from : "posts",
                    localField:"following",
                    foreignField: "userId",
                    as : "followingPosts"
                }
            },{
                $project:{
                  followingPosts : 1,
                  _id : 0,
                }
            }
        ])
        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts).sort((a,b)=>{
            return b.createdAT - a.createdAT;
        }))
    } catch (error) {
        res.status(500).json(error)
    }
}