const express = require("express");
const router = express.Router();

const MatchRequest = require("../models/MatchRequest");
const User = require("../models/User"); // ✅ You forgot to import User — fixed!

// ==============================
// GET Friends List
// ==============================
router.get('/friends/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find all accepted match requests where user is either sender or receiver
      const acceptedRequests = await MatchRequest.find({
        $or: [
          { senderId: userId },
          { receiverId: userId }
        ],
        isAccepted: true
      })
      .populate('senderId', 'name email')   // populate sender details
      .populate('receiverId', 'name email'); // populate receiver details
      const friends = acceptedRequests.map(request => {
        if (request.senderId && request.senderId._id.toString() === userId) {
          return request.receiverId;
        } else if (request.receiverId && request.receiverId._id.toString() === userId) {
          return request.senderId;
        } else {
          return null; // skip bad entry
        }
      }).filter(friend => friend !== null); // Remove any nulls
  
      res.status(200).json({ success: true, data: friends });
    } catch (error) {
      console.error("Error fetching friends:", error);
      res.status(500).json({ success: false, message: "Error fetching friends" });
    }
  });
      
     
  
router.post("/send", async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "Missing senderId or receiverId" });
  }

  try {
    const newMatchRequest = new MatchRequest({
      senderId,
      receiverId,
      isAccepted: false,
      isRejected: false,
    });

    await newMatchRequest.save();

    res.status(201).json({ message: "Match request sent successfully", data: newMatchRequest });
  } catch (error) {
    console.error("Error saving match request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==============================
// POST Send Match Request
// ==============================
router.post("/send", async (req, res) => {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "Missing senderId or receiverId" });
  }

  try {
    const newMatchRequest = new MatchRequest({
      senderId,
      receiverId,
      isAccepted: false,
      isRejected: false,
    });

    await newMatchRequest.save();

    res.status(201).json({ message: "Match request sent successfully", data: newMatchRequest });
  } catch (error) {
    console.error("Error saving match request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==============================
// PUT Accept Match Request
// ==============================
router.put("/accept/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedRequest = await MatchRequest.findByIdAndUpdate(
      id,
      { isAccepted: true, isRejected: false },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Match request not found" });
    }

    res.status(200).json({ message: "Match request accepted", data: updatedRequest });
  } catch (error) {
    console.error("Error accepting match request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==============================
// GET Received Match Requests
// ==============================
router.get("/received/:receiverId", async (req, res) => {
  const { receiverId } = req.params;

  try {
    const requests = await MatchRequest.find({ receiverId })
      .populate('senderId', 'name email');

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching received match requests:", error);
    res.status(500).json({ success: false, message: "Error fetching received match requests" });
  }
});

// ==============================
// GET Sent Match Requests
// ==============================
router.get("/sent/:senderId", async (req, res) => {
  const { senderId } = req.params;

  try {
    const sentRequests = await MatchRequest.find({ senderId })
      .populate('receiverId', 'name email');

    res.status(200).json({ success: true, data: sentRequests });
  } catch (error) {
    console.error("Error fetching sent match requests:", error);
    res.status(500).json({ success: false, message: "Error fetching sent match requests" });
  }
});

// ==============================
// GET User Info (name, email)
// ==============================
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('name email');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==============================
// GET All Match Requests for a User (Pending Only)
// ==============================
router.get("/matchrequest", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query" });
  }

  try {
    const matchRequests = await MatchRequest.find({
      receiverId: userId,
      isAccepted: false,
      isRejected: false,
    }).populate("senderId", "name email");

    res.status(200).json({ success: true, data: matchRequests });
  } catch (error) {
    console.error("Error fetching match requests:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==============================
// PUT Reject Match Request
// ==============================
router.put("/reject/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedRequest = await MatchRequest.findByIdAndUpdate(
      id,
      { isAccepted: false, isRejected: true },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Match request not found" });
    }

    res.status(200).json({ message: "Match request rejected", data: updatedRequest });
  } catch (error) {
    console.error("Error rejecting match request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
