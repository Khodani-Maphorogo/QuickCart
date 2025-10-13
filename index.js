// index.js
const mongoose = require("mongoose");
require("dotenv").config();
const { Clerk } = require("@clerk/clerk-sdk-node");

// Initialize Clerk with server secret key
const clerk = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

// MongoDB connection
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define user schema
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true },
  username: { type: String },
  email: { type: String },
  imageUrl: { type: String },
  cartItems: { type: Array, default: [] }, // Will store user's cart items
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Fetch users from Clerk and save/update them in MongoDB
async function fetchAndSaveClerkUsers() {
  try {
    // Fetch all users from Clerk
    const users = await clerk.users.getUserList();

    for (const u of users) {
      await User.updateOne(
        { clerkId: u.id },
        {
          clerkId: u.id,
          username: u.username || "",
          email: u.emailAddresses[0]?.emailAddress || "",
          imageUrl: u.profileImageUrl || "",
        },
        { upsert: true } // Insert if it doesn't exist
      );
    }

    // Fetch all users from MongoDB to verify
    const dbUsers = await User.find({}, "_id username email imageUrl cartItems __v");
    console.log("Users synced from Clerk:", dbUsers);
  } catch (err) {
    console.error("Error fetching Clerk users:", err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
fetchAndSaveClerkUsers();
