import csv from 'csvtojson';
import Player from '../models/player.js';
import { playerSchema } from '../validations/playerValidation.js';
import fs from 'fs';

export const createPlayer = async (req, res) => {
  try {
    const { error } = playerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const newPlayer = new Player(req.body);
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.status(200).json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const { error } = playerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const updated = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Player not found' });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const deleted = await Player.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Player not found' });

    res.status(200).json({ message: 'Player deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkUploadPlayers = async (req, res) => {
    try {
      const jsonArray = await csv().fromFile(req.file.path);
  
      const bulkOps = jsonArray.map(row => {
        // Trim and clean keys
        const cleanRow = {};
        Object.keys(row).forEach(key => {
            console.log(key);
          cleanRow[key.trim()] = row[key].trim();
        });
  
        const player = {
          _id: cleanRow._id,
          age: Number(cleanRow.age),
          country: cleanRow.country,
          role: cleanRow.role,
          basePrice: Number(cleanRow.basePrice),
          records: {
            batting: {
                totalRuns: Number(cleanRow['batting_totalRuns']) || 0,
                total4s: Number(cleanRow['batting_total4s']) || 0,
                total6s: Number(cleanRow['batting_total6s']) || 0,
                totalCenturies: Number(cleanRow['batting_totalCenturies']) || 0,
                total50s: Number(cleanRow['batting_total50s']) || 0,
                total20s: Number(cleanRow['batting_total20s']) || 0,
                total30s: Number(cleanRow['batting_total30s']) || 0,
                total40s: Number(cleanRow['batting_total40s']) || 0,
                battingAverage: Number(cleanRow['batting_battingAverage']) || 0,
              },
              bowling: {
                totalOvers: Number(cleanRow['bowling_totalOvers']) || 0,
                totalWides: Number(cleanRow['bowling_totalWides']) || 0,
                totalRuns: Number(cleanRow['bowling_totalRuns']) || 0,
                totalNoBalls: Number(cleanRow['bowling_totalNoBalls']) || 0,
                totalWickets: Number(cleanRow['bowling_totalWickets']) || 0,
              },
              fielding: {
                totalCatches: Number(cleanRow['fielding_totalCatches']) || 0,
                totalRunOuts: Number(cleanRow['fielding_totalRunOuts']) || 0,
              }
          }
        };
  
        return {
          updateOne: {
            filter: { _id: player._id },
            update: { $set: player },
            upsert: true
          }
        };
      });
  
      await Player.bulkWrite(bulkOps);
      fs.unlinkSync(req.file.path); // cleanup file
      res.status(200).json({ message: 'Bulk upload complete', count: bulkOps.length });
  
    } catch (error) {
      console.error('Bulk upload error:', error);
      res.status(500).json({ message: 'Bulk upload failed', error: error.message });
    }
  };
