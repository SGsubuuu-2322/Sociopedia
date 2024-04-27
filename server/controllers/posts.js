import Post from "../models/Posts.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      userPicturePath: user.picturePath,
      description,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const posts = await Post.find();
    return res.status(201).json(posts);
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
};

export const getPostFeeds = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(201).json(posts);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    return res.status(201).json(posts);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
