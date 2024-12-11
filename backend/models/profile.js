import mongoose from "mongoose"
const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    gender: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    about: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: Number,
        trim: true
    },
    alternativeContactNumber: {
        type: Number,
        trim: true
    },
    hintName: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
}, {
    timestamps: true
})

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;