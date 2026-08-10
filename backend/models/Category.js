const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        name: { type: String, required: true },
        type: { type: String, required: true, enum: ['INCOME', 'EXPENSE'] },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
