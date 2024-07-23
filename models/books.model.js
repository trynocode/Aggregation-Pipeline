import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Author",
        required: true
    }
},
    {
        timestamps: true,
    }
);

export const Book = mongoose.model("Book", bookSchema);