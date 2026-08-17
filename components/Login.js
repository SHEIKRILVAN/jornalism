function Login({ onLogin, showAlert }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate a tiny delay for better UX
        setTimeout(() => {
            const accounts = {
                rilwan: '123ril123'
            };

            if (accounts[username.trim()] === password) {
                sessionStorage.setItem('username', username.trim());
                onLogin();
            } else {
                showAlert('Invalid username or password. Please try again.', 'Access Denied');
                setIsLoading(false);
            }
        }, 600);
    };

    return (
        <div className="w-full max-w-sm mx-auto" data-name="login" data-file="components/Login.js">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                    <div className="icon-lock text-white text-3xl"></div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
                <p className="text-gray-500 text-sm">Please sign in to access your journal</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="icon-user text-gray-400"></div>
                        </div>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="input-field pl-11"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <div className="icon-key text-gray-400"></div>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-field pl-11"
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-primary mt-2"
                >
                    {isLoading ? (
                        <div className="icon-loader animate-spin"></div>
                    ) : (
                        <div className="icon-arrow-right"></div>
                    )}
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
}
