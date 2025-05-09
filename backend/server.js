// ========================
// Imports
// ========================
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const path = require("path");
const multer = require("multer");
require('dotenv').config();
const MatchRequestRoutes = require('./routes/MatchRequest');
const MatchRequest = require('./models/MatchRequest'); 
const Profile = require('./models/Profile');
const User = require('./models/User');








// ========================
// App Setup
// ========================
const app = express();
const server = http.createServer(app);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON body

app.use("/api/matchRequest", MatchRequestRoutes);

// ========================
// Routes Setup
// ========================

// ========================
// MongoDB Connection
// ========================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ========================
// File Upload Setup (Multer)
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify file upload folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Generate unique filename
  },
});

const upload = multer({ storage });


// ========================
// Mongoose Models
// ========================
// const ProfileSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   contact: String,
//   skill: String,
//   experience: String,
//   category: String,
//   photo: String,
// });

// //const Profile = mongoose.model("Profile", ProfileSchema);

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", UserSchema);


// ========================
// Express Routes (Profile, Auth, etc.)
// ========================
app.use('/api/matchRequest', MatchRequestRoutes); // Mount your MatchRequest routes

// Root route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});
// --- Profile Routes ---
app.get("/api/profiles", async (req, res) => {
  try {
    const { skill } = req.query;
    const query = skill && skill !== "All" ? { skill } : {};
    const profiles = await Profile.find(query);

    console.log("Profiles fetched:", profiles); // 👈 ADD THIS

    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profiles" });
  }
});

app.get("/matchrequest", async (req, res) => {
  const { userId } = req.query; // Get userId from query params

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query" });
  }

  try {
    const matchRequests = await MatchRequest.find({
      receiverId: userId,
      isAccepted: false,
      isRejected: false,
    }).populate("senderId", "name email"); // Populate sender details

    res.status(200).json({ message: "Match requests fetched successfully", data: matchRequests });
  } catch (error) {
    console.error("Error fetching match requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/matchRequest/sent", async (req, res) => {
  const { userId } = req.query; // Get userId from query params
  console.log("Saving Match Request:", newMatchRequest);

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query" });
  }

  try {
    const matchRequests = await MatchRequest.find({
      senderId: userId,
      isAccepted: false,
      isRejected: false,
    }).populate("receiverId", "name email"); // Populate sender details

    res.status(200).json({ message: "Match requests fetched successfully", data: matchRequests });
  } catch (error) {
    console.error("Error fetching match requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/profiles", upload.single("photo"), async (req, res) => {
  try {
    const { id,name, email, contact, skill, experience, category } = req.body;
    const photo = req.file ? req.file.filename : "";

    const newProfile = new Profile({
      _id:id,
      name,
      email,
      contact,
      skill,
      experience,
      category,
      photo,
    });
    await newProfile.save();

    res.status(201).json({ message: "✅ Profile created successfully!", profile: newProfile });
  } catch (error) {
    console.error("❌ Error saving profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// --- Auth Routes ---
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "✅ Signup successful!", user: newUser });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Internal server error during signup." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password!" });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "✅ Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// --- Get All Users (for Chat) ---
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/matchrequest/send", async (req, res) => {
  const { senderId, receiverId } = req.body;
  console.log("Inside server");

  if (!senderId || !receiverId) {
    return res.status(400).json({ message: "Missing senderId or receiverId" });
  }

  try {
    const newMatchRequest = new MatchRequest({
      senderId,
      receiverId,
      isAccepted: false,
      isRejected: false
    });

    await newMatchRequest.save();   // 👈 save it to your DB

    res.status(200).json({ message: "Match request sent successfully" });
  } catch (error) {
    console.error("Error saving match request:", error);
    res.status(500).json({ message: "Failed to send match request" });
  }
});



// ========================
// Socket.IO Setup
// ========================
// ========================
// Socket.IO Setup
// ========================
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5178"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const chatMessages = {};

// Fetch messages
app.get('/api/chat/:friendId', (req, res) => {
  const { friendId } = req.params;
  const messages = chatMessages[friendId] || [];
  res.json(messages);
});

// Send message
app.post('/api/chat/:friendId', (req, res) => {
  const { friendId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!chatMessages[friendId]) {
    chatMessages[friendId] = [];
  }

  chatMessages[friendId].push({ sender: 'You', message });
  res.status(201).json({ success: true });
});


// Socket Events
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
  socket.on("send_message", ({ message, room }) => { "..." });
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`🔵 User joined room: ${roomId}`);
  });

  socket.on("send_message", ({ message, room }) => {
    io.to(room).emit("receive_message", {
      message: message,
      senderId: socket.id,
    });
    console.log(`✉️ Message to room ${room}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});



  
// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`); // 🔥 Corrected quotes
}); 