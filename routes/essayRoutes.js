const express = require('express');
const Essay = require('../models/Essay');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// [Học viên] Gửi bài viết mới
router.post('/submit', verifyToken, async (req, res) => {
    try {
        const { originalContent } = req.body;
        const newEssay = new Essay({
            studentId: req.user.id,
            originalContent
        });
        await newEssay.save();
        res.status(201).json({ message: "Gửi bài thành công!", essayId: newEssay._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [Admin] Lấy danh sách bài đang chờ chấm
router.get('/pending', verifyAdmin, async (req, res) => {
    try {
        const pendingEssays = await Essay.find({ status: 'pending' }).populate('studentId', 'name email');
        res.json(pendingEssays);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [Admin] Chấm bài
router.post('/:id/grade', verifyAdmin, async (req, res) => {
    try {
        const { generalEvaluation, upgradeSuggestion, errorBlocks } = req.body;
        
        const updatedEssay = await Essay.findByIdAndUpdate(
            req.params.id,
            {
                status: 'graded',
                grading: {
                    adminId: req.user.id,
                    generalEvaluation,
                    upgradeSuggestion,
                    errorBlocks
                }
            },
            { new: true }
        );

        if (!updatedEssay) return res.status(404).json({ message: "Không tìm thấy bài viết!" });
        res.json({ message: "Đã chấm bài thành công!", essay: updatedEssay });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// [Học viên/Admin] Xem kết quả
router.get('/:id/result', verifyToken, async (req, res) => {
    try {
        const essay = await Essay.findById(req.params.id);
        if (!essay) return res.status(404).json({ message: "Không tìm thấy bài viết!" });
        
        if (essay.studentId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Bạn không có quyền xem kết quả này!" });
        }

        res.json(essay);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;