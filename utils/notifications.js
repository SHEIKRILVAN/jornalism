// Utility to handle local notifications/reminders
const NotificationManager = {
    checkAndNotify(showAlert) {
        const reminderTime = localStorage.getItem('journal_reminder_time');
        if (!reminderTime) return;

        const lastNotified = localStorage.getItem('journal_last_notified');
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];

        // If already notified today, skip
        if (lastNotified === todayStr) return;

        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHours}:${currentMinutes}`;

        if (currentTime === reminderTime) {
            // Trigger alert
            if (showAlert) {
                showAlert('Time to write your daily journal!', 'Reminder');
            }
            localStorage.setItem('journal_last_notified', todayStr);
        }
    },
    startChecking(showAlert) {
        // Check every minute
        setInterval(() => this.checkAndNotify(showAlert), 60000);
        // Also check immediately on load
        this.checkAndNotify(showAlert);
    }
};