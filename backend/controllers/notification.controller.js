import Notification from "../model/notification.model.js"
import User from "../model/user.model.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId }).sort({ createdAt: -1 });
        
        await Notification.updateMany({ to: userId }, { read: true });
        return res.status(200).json(notifications);
    } catch (error) {
        console.log("Error in getNotifications Controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteNotifications = async (req, res) => {
    try {
        const userId = req._id;
        const foundNotifications = await Notification.find({ to: userId });
        if (!foundNotifications || foundNotifications.length === 0) {
            return res.status(404).json({ message: "No Notifications Yet" });
        }
        await Notification.deleteMany({ to: userId });
        return res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications Controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const raiseNotification = async (req, res) => {
    try {
      const { to, type, message } = req.body;
      const from = req.user._id;
  
      if (!to || !type || !message) {
        return res.status(400).json({ error: "All fields are required." });
      }
  
      const toUserData = await User.findById(to).select("username email");
      const fromUserData = await User.findById(from).select("username email");
  
      if (!toUserData || !fromUserData) {
        return res.status(404).json({ error: "User not found." });
      }
  
      const notification = new Notification({
        from,
        to,
        type,
        message,
        toUser: {
          username: toUserData.username,
          email: toUserData.email,
        },
        fromUser: {
          username: fromUserData.username,
          email: fromUserData.email,
        },
      });
  
      await notification.save();
      return res.status(201).json(notification);
    } catch (error) {
      console.error("Error raising notification:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  