function ReminderConfig({ showAlert }) {
    const [time, setTime] = React.useState(localStorage.getItem('journal_reminder_time') || '');
    const [avatarUrl, setAvatarUrl] = React.useState(localStorage.getItem('journal_author_avatar') || '');
    const [bgUrl, setBgUrl] = React.useState(localStorage.getItem('journal_bg_image') || '');

    const handleSave = () => {
        if (avatarUrl) {
            localStorage.setItem('journal_author_avatar', avatarUrl);
        } else {
            localStorage.removeItem('journal_author_avatar');
        }

        if (bgUrl) {
            localStorage.setItem('journal_bg_image', bgUrl);
            window.dispatchEvent(new Event('bg-image-changed'));
        } else {
            localStorage.removeItem('journal_bg_image');
            window.dispatchEvent(new Event('bg-image-changed'));
        }

        if (!time) {
            localStorage.removeItem('journal_reminder_time');
            showAlert('Settings saved. Reminder is off.', 'Settings');
            return;
        }

        localStorage.setItem('journal_reminder_time', time);
        // Clear last notified so it can notify again if changed to today
        localStorage.removeItem('journal_last_notified');
        showAlert(`Settings saved. Daily reminder set for ${time}.`, 'Success');
    };

    return (
        <div className="pb-24 pt-6 px-4" data-name="reminder-config" data-file="components/ReminderConfig.js">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Settings</h2>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4 text-indigo-600">
                    <div className="icon-clock text-2xl"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Daily Reminder</h3>
                </div>
                
                <p className="text-gray-500 text-sm mb-5">
                    Set a time to get a daily reminder to write your journal. Building a habit takes consistency!
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input 
                            type="time" 
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Theme Image URL</label>
                        <input 
                            type="url" 
                            value={bgUrl}
                            onChange={(e) => setBgUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="input-field text-sm"
                        />
                    </div>

                    <button onClick={handleSave} className="btn-primary">
                        Save Preferences
                    </button>
                    
                    {time && (
                        <button 
                            onClick={() => {
                                setTime('');
                                localStorage.removeItem('journal_reminder_time');
                                showAlert('Reminder disabled.', 'Settings');
                            }} 
                            className="btn-secondary"
                        >
                            Turn off reminder
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}