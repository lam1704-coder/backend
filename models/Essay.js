const mongoose = require('mongoose');

const essaySchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalContent: { type: String, required: true }, // Tương đương baiChoChua
    status: { type: String, default: 'pending', enum: ['pending', 'graded'] },
    
    // Phần Admin chấm (Sẽ trống cho đến khi Admin lưu đánh giá)
    grading: {
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        generalEvaluation: { type: String }, // danhGiaChung
        upgradeSuggestion: { type: String }, // goiYNangCap
        errorBlocks: [{
            title: String,       // tieuDe
            original: String,    // doanGoc
            comment: String,     // nhanXet
            suggestion: String   // goiY
        }]
    }
}, { timestamps: true });

module.exports = mongoose.model('Essay', essaySchema);