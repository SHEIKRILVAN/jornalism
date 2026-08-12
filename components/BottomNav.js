function BottomNav({ currentTab, onChangeTab }) {
    const tabs = [
        { id: 'feed', icon: 'house', label: 'Feed' },
        { id: 'write', icon: 'square-plus', label: 'Write' },
        { id: 'settings', icon: 'clock', label: 'Reminder' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" data-name="bottom-nav" data-file="components/BottomNav.js">
            <div className="max-w-md mx-auto flex justify-around items-center h-16">
                {tabs.map(tab => {
                    const isActive = currentTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChangeTab(tab.id)}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                                isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <div className={`icon-${tab.icon} text-2xl ${isActive ? 'scale-110' : ''} transition-transform`}></div>
                            <span className="text-[10px] font-medium">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}