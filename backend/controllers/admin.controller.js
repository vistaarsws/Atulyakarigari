import User from "../models/user.js";
import Profile from "../models/profile.js";

// ✅ Add Admin (Update accountType to "admin")
export const addAdmin = async (req, res) => {
  const { email } = req.body;

  try {
    // 1️⃣ Find the Profile using the given email
    const profile = await Profile.findOne({ email });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    // 2️⃣ Get the User ID from the Profile
    const user = await User.findById(profile.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 3️⃣ Check if user is already admin or super-admin
    if (user.accountType === "admin") {
      return res.status(400).json({ success: false, message: "User is already an admin" });
    }
    if (user.accountType === "super-admin") {
      return res.status(400).json({ success: false, message: "User is already a super-admin" });
    }

    // 4️⃣ Update user accountType to "admin"
    user.accountType = "admin";
    await user.save();

    return res.json({ success: true, message: "User promoted to admin successfully!" });
  } catch (error) {
    console.error("❌ Error in addAdmin:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// ✅ Remove Admin (Update accountType back to "customer")
export const removeAdmin = async (req, res) => {
    const { email } = req.body;
  
    try {
      // 1️⃣ Find the Profile using the given email
      const profile = await Profile.findOne({ email });
      if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
  
      // 2️⃣ Get the User ID from the Profile
      const user = await User.findById(profile.userId);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
  
      // 3️⃣ Ensure user is actually an admin before demoting
      if (user.accountType !== "admin") {
        return res.status(400).json({ success: false, message: "User is not an admin" });
      }
  
      // 4️⃣ Update user accountType back to "customer"
      user.accountType = "customer";
      await user.save();
  
      return res.json({ success: true, message: "Admin demoted successfully!" });
    } catch (error) {
      console.error("❌ Error in removeAdmin:", error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  };
