import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'educreator_super_secret_123';
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

// Middleware
app.use(cors());
app.use(express.json());

// JSON DB Helper
async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

async function writeUsers(users) {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Ensure data file exists
(async () => {
    try {
        await fs.access(USERS_FILE);
    } catch {
        await writeUsers([]);
    }
})();

// Auth Routes

// SIGNUP
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const users = await readUsers();

        if (users.find(u => u.email === email || u.username === username)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashedPassword
        };

        users.push(newUser);
        await writeUsers(users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = await readUsers();

        const user = users.find(u => u.email === email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET PROFILE
app.get('/api/auth/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const users = await readUsers();
        const user = users.find(u => u.id === decoded.id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const { password, ...userData } = user;
        res.json(userData);
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT} (JSON DB)`));
