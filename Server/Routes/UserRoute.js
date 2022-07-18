import express from "express";
import {
  getUser,
  UpdateUser,
  deleteUser,
  followUser,
  unfollowUser,
} from "./../Controller/UserController.js";

const router = express.Router();

router.get("/:id", getUser) 
router.put("/:id",UpdateUser)
router.delete("/:id",deleteUser)
router.put("/:id/follow",followUser)
router.put("/:id/unfollow", unfollowUser);
export default router;
