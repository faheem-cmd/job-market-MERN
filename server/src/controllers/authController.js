import User from "../model/user.model.js";
import Jwt from "jsonwebtoken";
import { encryptPassword, checkPassword } from "../services/MiscServices.js";

export const signup = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(404).json({ message: "User already registered" });
    } else {
      const { name, phone, password, email } = req.body;
      const imagePath = req.file.path;
      const imageRelativePath = "/" + imagePath.replace(/\\/g, "/");
      const imageUrl =
        req.protocol + "://" + req.get("host") + imageRelativePath;
      const image = imageUrl;
      const encryptedPassword = await encryptPassword(password);
      let user = new User({
        name,
        email,
        phone,
        image,
        password: encryptedPassword,
      });
      const saveUser = await user.save();
      await res.status(201).json({
        status: 201,
        success: true,
        message: "Created",
        data: saveUser,
      });
    }
  } catch (error) {
    console.log(error);
    await res.status(500).json({ message: error });
  }
};
