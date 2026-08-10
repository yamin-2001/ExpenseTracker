const Transaction = require('../models/Transaction');

const getTransactions = async (req, res, next) => {
    try {
        const { type, category, startDate, endDate } = req.query;
        let query = { user: req.user.id };

        if (type) query.type = type;
        if (category) query.category = category;
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query).populate('category', 'name type').sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        next(error);
    }
};

const createTransaction = async (req, res, next) => {
    try {
        const { title, amount, type, category, date } = req.body;
        if (!title || !amount || !type || !category || !date) {
            res.status(400);
            throw new Error('Please add all fields');
        }

        const transaction = await Transaction.create({
            title,
            amount,
            type,
            category,
            date,
            user: req.user.id,
        });
        
        const populatedTransaction = await transaction.populate('category', 'name type');
        res.status(201).json(populatedTransaction);
    } catch (error) {
        next(error);
    }
};

const updateTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            res.status(404);
            throw new Error('Transaction not found');
        }
        if (transaction.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        const updatedTransaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('category', 'name type');
        res.status(200).json(updatedTransaction);
    } catch (error) {
        next(error);
    }
};

const deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            res.status(404);
            throw new Error('Transaction not found');
        }
        if (transaction.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await transaction.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};

const getSummary = async (req, res, next) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        
        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(t => {
            if (t.type === 'INCOME') totalIncome += t.amount;
            else if (t.type === 'EXPENSE') totalExpenses += t.amount;
        });

        const balance = totalIncome - totalExpenses;
        
        res.status(200).json({ totalIncome, totalExpenses, balance });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary
};
