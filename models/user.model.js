import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        unique: true,
        trim: true,
        index: true,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    registered: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
    },
    eyeColor: {
        type: String,
        required: true,
    },
    favoriteFruit: {
        type: String,
        required: true,
    },
    company: {
        title: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        location: {
            country: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            }
        },
    },
    tags: {
        type: [String],
        required: true
    }
}, {
    timestamps: true,
});

userSchema.plugin(mongooseAggregatePaginate);

export const User = mongoose.model("User", userSchema);
