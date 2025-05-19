import mongoose from 'mongoose';
import Tournament from '../models/tournament.js';
import Team from '../models/team.js';
import Player from '../models/player.js';
import SetupStatus from '../models/setupStatus.js';

// Helper function to get or create setup status
const getOrCreateSetupStatus = async () => {
    let setupStatus = await SetupStatus.findOne();
    if (!setupStatus) {
        setupStatus = new SetupStatus();
        await setupStatus.save();
    }
    return setupStatus;
};

export const getSetupStatus = async (req, res) => {
    try {
        // Check if all required data exists
        const [tournamentCount, teamCount, playerCount] = await Promise.all([
            Tournament.countDocuments(),
            Team.countDocuments(),
            Player.countDocuments()
        ]);

        const isSetupComplete = tournamentCount > 0 && teamCount > 0 && playerCount > 0;

        // Update status in database
        const setupStatus = await getOrCreateSetupStatus();
        setupStatus.isSetupComplete = isSetupComplete;
        await setupStatus.save();

        res.status(200).json({
            success: true,
            data: {
                isSetupComplete
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to get setup status',
            message: error.message
        });
    }
}; 