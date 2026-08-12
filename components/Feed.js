function Feed({ showAlert }) {
    const [journals, setJournals] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [editingJournal, setEditingJournal] = React.useState(null);
    const [editContent, setEditContent] = React.useState('');
    const [editMood, setEditMood] = React.useState('Normal');
    
    const currentUser = sessionStorage.getItem('username');

    const moods = ['Happy', 'Sad', 'Excited', 'Tired', 'Normal'];

    React.useEffect(() => {
        loadJournals();
    }, []);

    const loadJournals = async () => {
        try {
            setIsLoading(true);
            const data = await API.fetchJournals();
            setJournals(data);
        } catch (error) {
            showAlert(error.message, 'Error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (journal) => {
        const liker = currentUser || 'anonymous';
        const likedBy = journal.objectData.likedBy || [];
        
        if (likedBy.includes(liker)) {
            return showAlert('You have already liked this entry.', 'Notice');
        }
        
        try {
            setJournals(prev => prev.map(j => 
                j.objectId === journal.objectId 
                    ? { ...j, objectData: { ...j.objectData, likes: (j.objectData.likes || 0) + 1, likedBy: [...likedBy, liker] } }
                    : j
            ));
            await API.likeJournal(journal, liker);
        } catch (error) {
            loadJournals();
            showAlert(error.message, 'Error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
        try {
            setJournals(prev => prev.filter(j => j.objectId !== id));
            await API.deleteJournal(id);
            showAlert('Journal deleted.', 'Success');
        } catch (error) {
            loadJournals();
            showAlert('Failed to delete post.', 'Error');
        }
    };

    const startEdit = (journal) => {
        setEditingJournal(journal.objectId);
        setEditContent(journal.objectData.content);
        setEditMood(journal.objectData.mood);
    };

    const cancelEdit = () => {
        setEditingJournal(null);
        setEditContent('');
        setEditMood('Normal');
    };

    const saveEdit = async (journal) => {
        if (!editContent.trim()) {
            return showAlert('Journal content cannot be empty.', 'Required');
        }
        try {
            const updatedData = { ...journal.objectData, content: editContent.trim(), mood: editMood };
            
            setJournals(prev => prev.map(j => 
                j.objectId === journal.objectId 
                    ? { ...j, objectData: updatedData }
                    : j
            ));
            
            await API.updateJournal(journal.objectId, updatedData);
            setEditingJournal(null);
            showAlert('Journal updated.', 'Success');
        } catch (error) {
            loadJournals();
            showAlert('Failed to update post.', 'Error');
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4" data-name="feed-loading" data-file="components/Feed.js">
                <div className="icon-loader text-3xl text-indigo-500 animate-spin"></div>
                <p className="text-gray-500">Loading stories...</p>
            </div>
        );
    }

    return (
        <div className="pb-24 pt-6 px-4" data-name="feed" data-file="components/Feed.js">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Public Journal</h2>
            {journals.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="icon-book-open text-4xl text-gray-300 mb-3 mx-auto"></div>
                    <p className="text-gray-500">No journals yet. Be the first to write!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {journals.map(journal => {
                        const isOwner = journal.objectData.authorUsername === currentUser || (journal.objectData.author === currentUser);
                        const isEditing = editingJournal === journal.objectId;

                        return (
                            <div key={journal.objectId} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        {journal.objectData.authorAvatar ? (
                                            <img src={journal.objectData.authorAvatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold uppercase">
                                                {(journal.objectData.author || '?')[0]}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{journal.objectData.author}</p>
                                            <p className="text-xs text-gray-400">{formatDate(journal.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="text-2xl" title={isEditing ? editMood : journal.objectData.mood}>
                                        {getMoodEmoji(isEditing ? editMood : journal.objectData.mood)}
                                    </div>
                                </div>
                                
                                {isEditing ? (
                                    <div className="mb-4 space-y-3">
                                        <textarea 
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="input-field min-h-[100px] resize-none text-sm"
                                        ></textarea>
                                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                            {moods.map(m => (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => setEditMood(m)}
                                                    className={`px-3 py-1 rounded-full border text-xs whitespace-nowrap ${
                                                        editMood === m 
                                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' 
                                                            : 'bg-white border-gray-200 text-gray-600'
                                                    }`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed mb-4">
                                        {journal.objectData.content}
                                    </p>
                                )}
                                
                                <div className="flex items-center justify-between text-gray-400 border-t border-gray-50 pt-3">
                                    <button 
                                        onClick={() => handleLike(journal)}
                                        className={`flex items-center gap-1.5 transition-colors ${
                                            (journal.objectData.likedBy || []).includes(currentUser || 'anonymous')
                                                ? 'text-red-500'
                                                : 'hover:text-red-500'
                                        }`}
                                    >
                                        <div className="icon-heart"></div>
                                        <span className="text-xs font-medium">{journal.objectData.likes || 0}</span>
                                    </button>
                                    
                                    {isOwner && (
                                        <div className="flex items-center gap-3">
                                            {isEditing ? (
                                                <>
                                                    <button onClick={cancelEdit} className="text-xs hover:text-gray-700 transition-colors">Cancel</button>
                                                    <button onClick={() => saveEdit(journal)} className="text-xs text-indigo-600 font-medium hover:text-indigo-800 transition-colors">Save</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEdit(journal)} className="hover:text-indigo-600 transition-colors" title="Edit">
                                                        <div className="icon-pencil text-sm"></div>
                                                    </button>
                                                    <button onClick={() => handleDelete(journal.objectId)} className="hover:text-red-600 transition-colors" title="Delete">
                                                        <div className="icon-trash text-sm"></div>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}