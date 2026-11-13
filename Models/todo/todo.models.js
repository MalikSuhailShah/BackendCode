
import mongoose from "mongoose";

// Creating the Todo schema.
// This defines the structure and rules of a Todo document.
const todoSchema = new mongoose.Schema(
  {
    // Content/text of the Todo
    content: {
      type: String,       // Todo content is a String
      required: true,     // Content must be provided
    },

    // Stores whether the Todo is completed or not
    complete: {
      type: Boolean,      // Can only be true or false
      default: false,     // New Todo is incomplete by default
    },

    // Stores the ID of the user who created this Todo
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      // The ObjectId refers to a document
      // belonging to the User1 model
      ref: "User1",
    },

    // Stores the ID of the related SubTodo
    subTodo: {
      type: mongoose.Schema.Types.ObjectId,

      // The ObjectId refers to a document
      // belonging to the SubTodo model
      ref: "SubTodo",
    },
  },

  // Schema options
  {
    // Automatically creates:
    // createdAt → creation time
    // updatedAt → last modification time
    timestamps: true,
  }
);

// Creating the Todo model from todoSchema.
// "Todo" is the Mongoose model name.
export const Todo = mongoose.model("Todo", todoSchema);
