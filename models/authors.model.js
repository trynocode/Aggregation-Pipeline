import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({

    name: {
        type: String,
        unique: true,
        index : true,
        required: true
    },
    
    birth_year: {
        type: Number,
        required: true
    },
},
    {
        timestamps: true,
    }
);

export const Author = mongoose.model("Author", authorSchema);