
import mongoose from "mongoose";

// Creating the User schema.
// Schema defines the structure and rules of a User document.
const userSchema = new mongoose.Schema(
  {
    // Username of the user
    userName: {
      type: String,       // Data type is String
      required: true,     // Username must be provided
      unique: true,       // Two users cannot have the same username
      lowercase: true,    // Converts username to lowercase
    },

    // Email of the user
    Email: {
      type: String,       // Data type is String
      required: true,     // Email must be provided
      unique: true,       // Two users cannot have the same email
      lowercase: true,    // Converts email to lowercase
    },

    // Password of the user
    Password: {
      type: String,       // Password is stored as a String
      required: true,     // Password must be provided
    },
  },

  // Schema options
  {
    // Automatically adds:
    // createdAt → when the document was created
    // updatedAt → when the document was last updated
    timestamps: true,
  }
);

// Creating the User model from userSchema.
// "User1" is the Mongoose model name.
// This name is also used in ref: "User1" in other schemas.
export const User = mongoose.model("User1", userSchema);
