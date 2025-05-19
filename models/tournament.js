import mongoose from 'mongoose';

const tournamentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  numberOfTeams: {
    type: Number,
    required: true
  },
  playersEachTeam: {
    type: Number,
    required: true
  },
  amountPerTeam: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Tournament', tournamentSchema);