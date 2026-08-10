import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData);
        } catch (err) {
            setError(err);
        }
        setLoading(false);
    };

    return (
        <div >
            <div className="flex items-center justify-center pt-10 pb-10">
                <Link to="/" className="text-4xl font-bold text-indigo-600 flex items-center gap-3">
                    <img src="/favicon.svg" alt="Logo" className="w-12 h-12 drop-shadow-md" />
                    ExpenseTracker
                </Link>
            </div>
            <div className="flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white px-8 rounded-xl shadow-lg border border-gray-100">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center font-medium">{error}</div>}
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <input name="name" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Full name" value={formData.name} onChange={onChange} />
                            </div>
                            <div>
                                <input name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" value={formData.email} onChange={onChange} />
                            </div>
                            <div>
                                <input name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" value={formData.password} onChange={onChange} />
                            </div>
                        </div>
                        <div>
                            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                    <div className="text-center text-sm text-gray-600 pb-4 ">
                        Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
