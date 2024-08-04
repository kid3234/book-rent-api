import User from "../models/user";

export const getUser = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch users",
      details: error,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, location, role } = req.body;

    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({
        error: "user not found",
      });

    await user.update({
      name,
      email,
      phone,
      location,
      role,
    });

    res.json({
      message: "User updated successfilly",
      user,
    });
  } catch (error) {
    res.status(500).json({
      error: "Faild to update user",
      details: error,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user)
      return res.status(404).json({
        error: "User not found",
        details: error,
      });

    await user.destroy();
    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete user",
      details: error,
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "user not found" });

    user.status = status;

    await user.save();
    res.json({ message: "User status updated successfully", user });
  } catch (error) {
    res.status(500).json({
      error: "Error updating user status",
      details: error,
    });
  }
};
