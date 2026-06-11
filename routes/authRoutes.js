const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email đã được sử dụng!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Quy định: Nếu email là admin@gmail.com thì tự động cấp quyền admin
        const role = email === 'admin@gmail.com' ? 'admin' : 'student';
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Sai email hoặc mật khẩu!" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({ message: "Đăng nhập thành công!", token, role: user.role, name: user.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;