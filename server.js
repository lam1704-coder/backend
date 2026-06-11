const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const essayRoutes = require('./routes/essayRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Đã kết nối với Database MongoDB!"))
    .catch((err) => console.log("❌ Lỗi kết nối Database:", err));

// Cấu hình API Routes
app.use('/api/auth', authRoutes);
app.use('/api/essays', essayRoutes);

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});