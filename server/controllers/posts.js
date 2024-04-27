import Post from "../models/Posts.js";
import User from "../models/User.js";

// Create operation...
export const createPosts = async (req, res) => {
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

// Read Operations...
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

// Updata Operations....
export const likePosts = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(id);
    const isLiked = await post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    return res.status(200).json({ updatedPost });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
