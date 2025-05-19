import Team from '../models/team.js';
import { teamSchema } from '../validations/teamValidation.js';
import csv from 'csvtojson';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import Tournament from '../models/tournament.js';

export const createTeam = async (req, res) => {
    try {
        const { error } = teamSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const newTeam = new Team({
            _id: req.body._id,      // ✅ using name as _id
            owner: req.body.owner,
            players: req.body.players,
            lock: req.body.lock
        });
        const savedTeam = await newTeam.save();
        res.status(201).json(savedTeam);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('players');
        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const bulkUploadTeams = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'CSV file required' });

        const jsonArray = await csv().fromFile(req.file.path);
        const teamsToInsert = [];

        const tournament = await Tournament.find({});

        for (const row of jsonArray) {
            const _id = row._id?.trim();
            const owner = row.owner?.trim();
            const lock = row.lock?.toString().toLowerCase() === 'true';
            const budgetLeft = tournament[0].amountPerTeam;

            if (!_id || !owner) continue;

            const { error } = teamSchema.validate({ _id, owner, lock });
            if (error) {
                console.warn(`Skipping invalid row: ${error.message}`);
                continue;
            }

            const exists = await Team.findById(_id);
            if (exists) {
                console.log(`Skipping duplicate team: ${_id}`);
                continue;
            }

            teamsToInsert.push({ _id, owner, lock, budgetLeft });
        }

        if (teamsToInsert.length === 0) {
            return res.status(400).json({ message: 'No valid teams to insert' });
        }

        const inserted = await Team.insertMany(teamsToInsert, { ordered: false });

        const users = jsonArray
        .map(team => team.owner?.trim())
        .map(owner => ({ username: owner, password: `${owner.replace(/\s+/g, "")}@123`, role: 'Owner' }));
        createUsers(users);

        res.status(201).json({ message: `${inserted.length} teams inserted`, inserted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const createUsers = async (users) => {
    const hashedUsers = await Promise.all(users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
            username: user.username,
            password: hashedPassword,
            role: user.role || 'Player'
        };
    }));

    await User.insertMany(hashedUsers);
}