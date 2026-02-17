import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },  
    date: { type: Date, required: true },
    location: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    time: { type: String, required: true },
    price: {type: Number, required: true},
    resisteredUsers: [
         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    ]


    
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);

export default Event;