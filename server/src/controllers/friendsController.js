import Friends from "../model/friends.model.js";

export const addFriends = async (req, res) => {
  try {
    let user_id = await req.user.user_data.user_id;
    const { friendId } = await req?.body;
    let myList = await Friends.find({ myId: user_id });
    const isFriendExist = await myList.filter(
      (item) => item?.friendId == friendId
    );
    if (isFriendExist?.length > 0) {
      await Friends.findByIdAndDelete(isFriendExist[0]?._id);
      await res.status(200).json({
        status: 200,
        success: true,
        message: "removed",
      });
    } else {
      let friends = new Friends({
        myId: user_id,
        friendId,
      });
      let myFriends = await friends.save();
      await res.status(201).json({
        status: 201,
        success: true,
        message: "Created",
        data: myFriends,
      });
    }
  } catch (error) {
    await res.status(500).json({ message: error });
  }
};

// function create(req, res, next) {
//   let name = req.body.name;
//   let rate = req.body.rate;

//   let meals = new Meals({
//     name,
//     rate,
//   });
//   meals.save().then((data) => {
//     res.status(200).json({ status: "success", data: data });
//   });
// }
