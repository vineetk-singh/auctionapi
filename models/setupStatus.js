import mongoose from 'mongoose';

const setupStatusSchema = new mongoose.Schema({
    isSetupComplete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure only one document exists
setupStatusSchema.pre('save', async function(next) {
    const count = await this.constructor.countDocuments();
    if (count > 0 && this.isNew) {
        throw new Error('Only one setup status document can exist');
    }
    next();
});

const SetupStatus = mongoose.model('SetupStatus', setupStatusSchema);

export default SetupStatus; 