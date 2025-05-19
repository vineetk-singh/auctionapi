import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    _id: { // ✅ Team name becomes the ID
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    lock: {
        type: Boolean,
        default: false
    },
    budgetLeft: {
        type: Number
    },
});

export default mongoose.model('Team', teamSchema);