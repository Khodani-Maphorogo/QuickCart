import { Inngest } from "inngest";
import connectDB from "./db";
import { User } from "lucide-react"; // Make sure this is your Mongoose model

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
  {
    id: 'sync-user-from-clerk'
  },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, profile_image_url } = event.data || {};

      if (!id || !email_addresses?.[0]?.email_address) {
        console.warn("Missing required user data:", event.data);
        return;
      }

      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        imageUrl: profile_image_url || null // ✅ fixed
      };

      await connectDB();
      await User.create(userData);

      console.log("User created:", userData);
    } catch (err) {
      console.error("Error in syncUserCreation:", err);
      return; 
    }
  }
);

// Inngest Function to update user data in the database
export const syncUserUpdation = inngest.createFunction(
  {
    id: 'update-user-from-clerk'
  },
  { event: 'clerk/user.updated' },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, profile_image_url } = event.data || {};

      if (!id) {
        console.warn("Missing user id for update:", event.data);
        return;
      }

      const userData = {
        _id: id,
        email: email_addresses?.[0]?.email_address || null,
        name: `${first_name} ${last_name}`,
        imageUrl: profile_image_url || null
      };

      await connectDB();
      await User.findByIdAndUpdate(id, userData);

      console.log("User updated:", { _id: id, ...userData });
    } catch (err) {
      console.error("Error in syncUserUpdation:", err);
      return;
    }
  }
);

// Inngest Function to delete user data from the database
export const syncUserDeletion = inngest.createFunction(
  {
    id: 'delete-user-from-clerk'
  },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    try {
      const { id } = event.data || {};

      if (!id) {
        console.warn("Missing user id for deletion:", event.data);
        return;
      }

      await connectDB();
      await User.findByIdAndDelete(id);

      console.log("User deleted:", id);
    } catch (err) {
      console.error("Error in syncUserDeletion:", err);
      return; // ✅ ensures run is completed;
    }
  }
);
