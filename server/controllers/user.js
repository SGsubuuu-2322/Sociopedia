import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return {
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
          };
        }
      );

      return res.status(200).json(formattedFriends);
    }

    return res.status(404).json({ error: "User not found" });
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends.filter((fId) => fId !== friendId);
      friend.friends.filter((fId) => fId !== friendId);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
        };
      }
    );

    return res.status(200).json(formattedFriends);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
};
