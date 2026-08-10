import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2, Filter } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [filters, setFilters] = useState({ type: '', category: '', startDate: '', endDate: '' });
    
    const [showForm, setShowForm] = useState(false);
    const [newTx, setNewTx] = useState({ title: '', amount: '', type: 'EXPENSE', category: '', date: new Date().toISOString().split('T')[0] });

    const fetchData = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const [txRes, catRes] = await Promise.all([
                api.get(`/transactions?${queryParams}`),
                api.get('/categories')
            ]);
            setTransactions(txRes.data);
            setCategories(catRes.data);
            if (newTx.category === '' && catRes.data.length > 0) {
                setNewTx(prev => ({ ...prev, category: catRes.data[0]._id }));
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/transactions', newTx);
            setNewTx({ title: '', amount: '', type: 'EXPENSE', category: categories[0]?._id || '', date: new Date().toISOString().split('T')[0] });
            setShowForm(false);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(transactions.filter(t => t._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center transition-colors">
                    <Plus size={18} className="mr-1" /> {showForm ? 'Cancel' : 'New Transaction'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 animate-in slide-in-from-top-4 duration-300">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Transaction</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <input type="text" placeholder="Title" required className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={newTx.title} onChange={(e) => setNewTx({ ...newTx, title: e.target.value })} />
                        <input type="number" placeholder="Amount" required min="0" step="0.01" className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} />
                        <select className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={newTx.type} onChange={(e) => {
                            const newType = e.target.value;
                            const filtered = categories.filter(c => c.type === newType);
                            setNewTx({ ...newTx, type: newType, category: filtered.length > 0 ? filtered[0]._id : '' });
                        }}>
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                        <select required className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={newTx.category} onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}>
                            <option value="" disabled>Select Category</option>
                            {categories.filter(c => c.type === newTx.type).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        <input type="date" required className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={newTx.date} onChange={(e) => setNewTx({ ...newTx, date: e.target.value })} />
                        <div className="lg:col-span-5 flex justify-end">
                            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
                <div className="flex items-center text-gray-500 font-medium"><Filter size={18} className="mr-2"/> Filters:</div>
                <select className="p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                    <option value="">All Types</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                </select>
                <select className="p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                <input type="date" className="p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
                <span className="text-gray-400">to</span>
                <input type="date" className="p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
                <button onClick={() => setFilters({ type: '', category: '', startDate: '', endDate: '' })} className="text-sm text-indigo-600 hover:text-indigo-800 ml-auto font-medium">Clear Filters</button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading transactions...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.category?.name || 'Uncategorized'}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleDelete(tx._id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">No transactions found. Add some to see them here!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Transactions;
