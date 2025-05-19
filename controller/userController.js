import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const bulkRegisterUsers = async (req, res) => {
    try {
      const users = req.body.users; // Expecting an array of { username, password, role }
  
      if (!Array.isArray(users)) {
        return res.status(400).json({ error: 'Invalid users array' });
      }
  
      const hashedUsers = await Promise.all(users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          username: user.username,
          password: hashedPassword,
          role: user.role || 'Player'
        };
      }));
  
      await User.insertMany(hashedUsers);
      res.status(201).json({ message: 'Users registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
  
      const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET
      );
  
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .json({
        token: accessToken,
        user: {
          id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const refreshAccessToken = (req, res) => {
    const token = req.cookies.refreshToken;
  
    if (!token) return res.status(401).json({ error: 'No refresh token' });
  
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid refresh token' });
  
      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
  
      res.json({ token: accessToken });
    });
  };

  //check if user is authenticated based on the cookie token
  export const authStatus = (req, res) => {
    const token = req.cookies.token;
  
    if (!token) return res.status(401).json({ error: 'No token provided' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ error: 'Invalid token' });
  
      res.json({
        user: {
          token: token,
          role: decoded.role
        }
      });
    });
  }