import User from "../model/user.model.js";
import Friends from "../model/friends.model.js";
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

export const getUsers = async (req, res) => {
  let user_id = req.user.user_data.user_id;
  try {
    const user = await User.find({});
    const friends = await Friends.find({ myId: user_id });
    if (user) {
      let userData = await user?.map((item) => {
        return {
          user: item?._id,
          name: item?.name,
          email: item?.email,
          image: item?.image,
          phone: item?.phone,
          isMyFriend:
            friends?.filter((value) => value?.friendId == item?._id)?.length > 0
              ? true
              : false,
        };
      });
      await res.status(200).json({
        status: 200,
        success: true,
        data: userData,
      });
    } else {
      res.status(201).json({
        success: false,
        message: "something wrong",
      });
    }
  } catch (error) {
    console.log(error);
    await res.status(500).json({ message: error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const filter = { email: email };
  const result = await User.find(filter);
  if (result.length == 0) {
    return res
      .status(404)
      .json({ status: "error", message: "Incorrect email" });
  } else {
    const user = result[0];
    const user_data = {
      user_id: result[0]._id,
    };
    let check = await checkPassword(password, user.password);
    if (check) {
      let accessToken = Jwt.sign({ user_data }, "access-key-secrete", {
        expiresIn: "1d",
      });
      let refreshToken = Jwt.sign({ user_data }, "access-key-secrete", {
        expiresIn: "7d",
      });
      // req.session.user = device;
      // let first_time = await Profession.findOne({ email: req.body.email });
      const update = {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
      await User.findOneAndUpdate(filter, update, { new: true });
      const tokens = {
        accessToken,
        refreshToken,
      };
      return res.status(200).json({
        status: "success",
        data: tokens,
        message: "Logged in successfully",
        // first_time: first_time == null ? true : false,
      });
    } else {
      return res.status(404).json({ message: "Invalid credentails" });
    }
  }
};

export const refreshToken = async (req, res) => {
  const refresh = req.body.refreshToken;
  try {
    const decoded = Jwt.verify(refresh, "access-key-secrete");
    const user = await User.findOne({
      _id: decoded.user_data?.user_id,
      refresh_token: refresh,
    });
    if (!user) {
      throw new Error();
    }

    const user_data = {
      user_id: user._id,
    };

    // Generate a new access token
    const accessToken = Jwt.sign({ user_data }, "access-key-secrete", {
      expiresIn: "1d",
    });
    const refreshToken = Jwt.sign({ user_data }, "access-key-secrete", {
      expiresIn: "7d",
    });
    const update = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
    const filter = { _id: user._id };
    await User.findOneAndUpdate(filter, update, { new: true });
    res.json({ data: update });
    // Return the new access token
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
