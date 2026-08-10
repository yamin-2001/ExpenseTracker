import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Navbar from './components/Navbar';

function App() {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="flex h-screen items-center justify-center text-xl font-bold text-gray-700">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
            {user && <Navbar />}
            <div className="flex-grow">
                <Routes>
                    <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
                    <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/login" />} />
                    <Route path="/categories" element={user ? <Categories /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
