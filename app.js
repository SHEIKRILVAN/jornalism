class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-sm w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="icon-triangle-alert text-4xl text-red-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-500 mb-6">We're sorry, but something unexpected happened. Please try reloading the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = React.useState(sessionStorage.getItem('is_auth') === 'true');
    const [currentTab, setCurrentTab] = React.useState('feed');
    const [alertConfig, setAlertConfig] = React.useState({ isOpen: false, title: '', message: '' });
    const [bgImage, setBgImage] = React.useState(localStorage.getItem('journal_bg_image') || '');

    React.useEffect(() => {
        const handleBgChange = () => setBgImage(localStorage.getItem('journal_bg_image') || '');
        window.addEventListener('bg-image-changed', handleBgChange);
        return () => window.removeEventListener('bg-image-changed', handleBgChange);
    }, []);

    const showAlert = (message, title = 'Notification') => {
        setAlertConfig({ isOpen: true, title, message });
    };

    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
    };

    React.useEffect(() => {
        // Start checking for reminders only if authenticated
        if (isAuthenticated) {
            NotificationManager.startChecking(showAlert);
        }
    }, [isAuthenticated]);

    const handleLogin = () => {
        sessionStorage.setItem('is_auth', 'true');
        setIsAuthenticated(true);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-color)] flex justify-center" data-name="app" data-file="app.js">
            <div 
                className="w-full max-w-md relative min-h-screen shadow-xl shadow-gray-200/50 sm:border-x sm:border-gray-100 flex flex-col transition-all duration-500 bg-[var(--bg-color)]"
                style={bgImage ? {
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                } : {}}
            >
                {bgImage && <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0"></div>}
                
                <div className="relative z-10 flex flex-col flex-1 h-full w-full">
                {!isAuthenticated ? (
                    <div className="flex-1 flex flex-col justify-center px-4">
                        <Login onLogin={handleLogin} showAlert={showAlert} />
                    </div>
                ) : (
                    <>
                        {/* Header (Optional, but good for context) */}
                        <header className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                                    <div className="icon-book text-white text-lg"></div>
                                </div>
                                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Daily Flow</h1>
                            </div>
                            <div className="flex items-center gap-1">
                                <a 
                                    href="big-screen.html"
                                    className="text-gray-400 hover:text-indigo-600 p-2 transition-colors"
                                    title="Big Screen Mode"
                                >
                                    <div className="icon-monitor-play text-xl"></div>
                                </a>
                                <button 
                                    onClick={() => {
                                        sessionStorage.removeItem('is_auth');
                                        setIsAuthenticated(false);
                                    }}
                                    className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                                    title="Sign Out"
                                >
                                    <div className="icon-log-out text-xl"></div>
                                </button>
                            </div>
                        </header>

                        {/* Main Content Area */}
                        <main className="min-h-[calc(100vh-64px)] pb-20">
                            {currentTab === 'feed' && <Feed showAlert={showAlert} />}
                            {currentTab === 'write' && <WriteJournal showAlert={showAlert} onComplete={() => setCurrentTab('feed')} />}
                            {currentTab === 'settings' && <ReminderConfig showAlert={showAlert} />}
                        </main>

                        <BottomNav currentTab={currentTab} onChangeTab={setCurrentTab} />
                    </>
                )}
                </div>

                <CustomAlert 
                    isOpen={alertConfig.isOpen}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    onClose={closeAlert}
                />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);