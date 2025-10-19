// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// -------- MongoDB Connection --------
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// -------- User Schema --------
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model("User", userSchema);

// -------- Routes --------

// Register
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return res.json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "Registration successful" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Test Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// -------- Start Server --------
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
