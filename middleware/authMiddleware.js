const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Từ chối truy cập! Chưa có token." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin user vào request
        next();
    } catch (err) {
        res.status(400).json({ message: "Token không hợp lệ!" });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Chỉ Admin mới có quyền thực hiện hành động này!" });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };