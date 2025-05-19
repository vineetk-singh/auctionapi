import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true // Player name as ID
  },
  age: {
    type: Number,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['batting', 'bowling', 'allrounder'],
    required: true
  },
  records: {
    batting: {
      totalRuns: { type: Number, default: 0 },
      total4s: { type: Number, default: 0 },
      total6s: { type: Number, default: 0 },
      totalCenturies: { type: Number, default: 0 },
      total50s: { type: Number, default: 0 },
      total20s: { type: Number, default: 0 },
      total30s: { type: Number, default: 0 },
      total40s: { type: Number, default: 0 },
      battingAverage: { type: Number, default: 0 }
    },
    bowling: {
      totalOvers: { type: Number, default: 0 },
      totalWides: { type: Number, default: 0 },
      totalRuns: { type: Number, default: 0 },
      totalNoBalls: { type: Number, default: 0 },
      totalWickets: { type: Number, default: 0 }
    },
    fielding: {
      totalCatches: { type: Number, default: 0 },
      totalRunOuts: { type: Number, default: 0 }
    }
  },
  basePrice: {
    type: Number,
    required: true
  }
}, { _id: false }); // prevent auto ObjectId

export default mongoose.model('Player', playerSchema);