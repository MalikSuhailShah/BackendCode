
import mongoose from "mongoose";

// Creating the SubTodo schema.
// This defines the structure and rules of a SubTodo document.
const subTodoSchema = new mongoose.Schema(
  {
    // Content/text of the SubTodo
    content: {
      type: String,       // SubTodo content is a String
      required: true,     // Content must be provided
    },

    // Stores whether the SubTodo is completed
    complete: {
      type: Boolean,      // Can be true or false
      default: false,     // New SubTodo is incomplete by default
    },

    // Stores the ID of the user who created this SubTodo
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      // This ObjectId refers to the User1 model
      ref: "User1",
    },
  },

  // Schema options
  {
    // Automatically adds:
    // createdAt → when the SubTodo was created
    // updatedAt → when it was last modified
    timestamps: true,
  }
);

// Creating the SubTodo model from subTodoSchema.
export const SubTodo = mongoose.model("SubTodo", subTodoSchema);

