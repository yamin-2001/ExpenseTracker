import { useState, useEffect } from 'react';
import api from '../utils/api';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await api.get('/transactions/summary');
                setSummary(res.data);
            } catch (error) {
                console.error("Error fetching summary", error);
            }
            setLoading(false);
        };
        fetchSummary();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-600">Loading summary...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                    <div className="p-4 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Balance</p>
                        <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>${summary.balance.toFixed(2)}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                    <div className="p-4 rounded-full bg-green-50 text-green-600 mr-4">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Income</p>
                        <p className="text-2xl font-bold text-gray-900">${summary.totalIncome.toFixed(2)}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                    <div className="p-4 rounded-full bg-red-50 text-red-600 mr-4">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                        <p className="text-2xl font-bold text-gray-900">${summary.totalExpenses.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
