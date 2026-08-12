function BigScreenApp() {
    const [journals, setJournals] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const bgImage = localStorage.getItem('journal_bg_image') || '';

    React.useEffect(() => {
        loadJournals();
    }, []);

    const loadJournals = async () => {
        try {
            setIsLoading(true);
            const data = await API.fetchJournals();
            setJournals(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getMoodEmoji = (mood) => {
        const map = { Happy: '😊', Sad: '😔', Excited: '🤩', Tired: '😴', Normal: '😐' };
        return map[mood] || '😐';
    };

    return (
        <div 
            className="min-h-screen transition-all duration-500 relative" 
            style={bgImage ? {
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed'
            } : {}}
            data-name="big-screen-app"
            data-file="big-screen-app.js"
        >
            {bgImage && <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-0"></div>}
            
            <div className="relative z-10">
                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <div className="icon-book text-white text-xl"></div>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Daily Flow <span className="text-gray-400 font-medium text-lg ml-2">Big Screen Space</span></h1>
                        </div>
                        <a href="index.html" className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-xl">
                            <div className="icon-arrow-left"></div>
                            Back to Mobile App
                        </a>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <div className="icon-loader text-4xl text-indigo-500 animate-spin"></div>
                            <p className="text-gray-600 font-medium">Loading journals from everyone...</p>
                        </div>
                    ) : journals.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200/50">
                            <div className="icon-book-open text-6xl text-gray-300 mb-4 mx-auto"></div>
                            <p className="text-gray-500 text-lg">No journals yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {journals.map(journal => (
                                <div key={journal.objectId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full hover:-translate-y-1 transform">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            {journal.objectData.authorAvatar ? (
                                                <img src={journal.objectData.authorAvatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-indigo-50" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold uppercase text-lg">
                                                    {(journal.objectData.author || '?')[0]}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-gray-900">{journal.objectData.author}</p>
                                                <p className="text-xs text-gray-400 font-medium">{formatDate(journal.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="text-3xl bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center" title={journal.objectData.mood}>
                                            {getMoodEmoji(journal.objectData.mood)}
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-700 whitespace-pre-wrap text-base leading-relaxed flex-grow">
                                        {journal.objectData.content}
                                    </p>
                                    
                                    <div className="flex items-center gap-1.5 text-red-500 border-t border-gray-50 pt-4 mt-4">
                                        <div className="icon-heart text-lg"></div>
                                        <span className="text-sm font-bold">{journal.objectData.likes || 0}</span>
                                        <span className="text-xs text-gray-400 ml-1">Likes</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BigScreenApp />);