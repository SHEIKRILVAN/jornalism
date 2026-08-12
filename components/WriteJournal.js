function WriteJournal({ showAlert, onComplete }) {
    const [author, setAuthor] = React.useState(localStorage.getItem('journal_author_name') || '');
    const [content, setContent] = React.useState('');
    const [mood, setMood] = React.useState('Normal');
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const moods = ['Happy', 'Sad', 'Excited', 'Tired', 'Normal'];
    
    // Check daily limit (simple client side check for demonstration)
    const canWriteToday = () => {
        const lastWritten = localStorage.getItem('journal_last_written_date');
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Let's say limit is 1 per day per device for simplicity, 
        // though requirement was just "compulsory limit". 
        // We'll allow up to 3 for better UX testing.
        const count = parseInt(localStorage.getItem('journal_today_count') || '0', 10);
        
        if (lastWritten !== todayStr) {
            return true; // New day
        }
        return count < 3;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!author.trim()) return showAlert('Please enter your name.', 'Required');
        if (!content.trim()) return showAlert('Journal content cannot be empty.', 'Required');
        
        if (!canWriteToday()) {
            return showAlert('You have reached your daily limit. Take a rest and come back tomorrow!', 'Limit Reached');
        }

        try {
            setIsSubmitting(true);
            const username = sessionStorage.getItem('username') || author.trim();
            
            await API.createJournal({
                author: author.trim(),
                content: content.trim(),
                mood: mood,
                likes: 0,
                authorAvatar: localStorage.getItem('journal_author_avatar') || '',
                authorUsername: username
            });

            // Save preferences & limit
            localStorage.setItem('journal_author_name', author.trim());
            const todayStr = new Date().toISOString().split('T')[0];
            const lastWritten = localStorage.getItem('journal_last_written_date');
            
            if (lastWritten !== todayStr) {
                localStorage.setItem('journal_last_written_date', todayStr);
                localStorage.setItem('journal_today_count', '1');
            } else {
                const count = parseInt(localStorage.getItem('journal_today_count') || '0', 10);
                localStorage.setItem('journal_today_count', (count + 1).toString());
            }

            setContent('');
            setMood('Normal');
            showAlert('Your journal has been shared!', 'Success');
            onComplete(); // Switch back to feed

        } catch (error) {
            showAlert(error.message, 'Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pb-24 pt-6 px-4" data-name="write-journal" data-file="components/WriteJournal.js">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Write Journal</h2>
            
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input 
                        type="text" 
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g., Alex"
                        className="input-field"
                        maxLength="30"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">How are you feeling?</label>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {moods.map(m => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setMood(m)}
                                className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-colors ${
                                    mood === m 
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' 
                                        : 'bg-white border-gray-200 text-gray-600'
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What happened today?</label>
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Dear Diary..."
                        className="input-field min-h-[150px] resize-none"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-primary"
                >
                    {isSubmitting ? (
                        <div className="icon-loader animate-spin"></div>
                    ) : (
                        <div className="icon-send"></div>
                    )}
                    {isSubmitting ? 'Posting...' : 'Post to Feed'}
                </button>
            </form>
        </div>
    );
}