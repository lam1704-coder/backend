const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const essayRoutes = require('./routes/essayRoutes');

const app = express();

// --- CẤU HÌNH CORS (QUAN TRỌNG NHẤT) ---
// Thay 'https://ten-user-cua-ban.github.io' bằng URL trang web thực tế của bạn
const corsOptions = {
    origin: '*', // Nếu muốn cho phép tất cả, bạn dùng '*', nếu muốn bảo mật thì thay bằng URL GitHub Pages của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Đã kết nối với Database MongoDB!"))
    .catch((err) => console.log("❌ Lỗi kết nối Database:", err));

// Cấu hình API Routes
app.use('/api/auth', authRoutes);
app.use('/api/essays', essayRoutes);

// Route mặc định để kiểm tra server còn sống không
app.get('/', (req, res) => {
    res.send("Server is running!");
});

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});