// Wrapper for Firebase/Trickle DB operations
const firestore = typeof firebase !== 'undefined' ? firebase.firestore() : null;

const API = {
    async fetchJournals() {
        try {
            if (firestore) {
                const snapshot = await firestore
                    .collection('journal_entry')
                    .orderBy('createdAt', 'desc')
                    .limit(50)
                    .get();
                return snapshot.docs.map(doc => ({ objectId: doc.id, ...doc.data() }));
            }

            if (typeof trickleListObjects === 'function') {
                const response = await trickleListObjects('journal_entry', 50, true, undefined);
                return response?.items || [];
            }

            // Fallback: read localStorage-stored journals
            const local = JSON.parse(localStorage.getItem('local_journals') || '[]');
            return local;
        } catch (error) {
            console.error('API.fetchJournals error:', error);
            // Return empty list on error to avoid app break
            return [];
        }
    },
    async createJournal(data) {
        try {
            if (firestore) {
                const item = {
                    objectData: data,
                    createdAt: new Date().toISOString()
                };
                const doc = await firestore.collection('journal_entry').add(item);
                return { objectId: doc.id, ...item };
            }

            if (typeof trickleCreateObject === 'function') {
                return await trickleCreateObject('journal_entry', data);
            }

            // Local fallback: persist to localStorage and return an object matching Trickle shape
            const id = 'local-' + Date.now();
            const item = {
                objectId: id,
                createdAt: new Date().toISOString(),
                objectData: data
            };

            const arr = JSON.parse(localStorage.getItem('local_journals') || '[]');
            // Prepend so newest appear first
            arr.unshift(item);
            localStorage.setItem('local_journals', JSON.stringify(arr));
            return item;
        } catch (error) {
            console.error('API.createJournal error:', error);
            throw new Error('Network error: Failed to save journal. Please try again.');
        }
    },
    async likeJournal(journal, username) {
        try {
            const likedBy = journal.objectData.likedBy || [];
            if (likedBy.includes(username)) {
                throw new Error('You already liked this post.');
            }
            const newLikes = (journal.objectData.likes || 0) + 1;
            const updatedData = {
                ...journal.objectData,
                likes: newLikes,
                likedBy: [...likedBy, username]
            };

            if (firestore) {
                await firestore.collection('journal_entry').doc(journal.objectId).update({ objectData: updatedData });
                return { ...journal, objectData: updatedData };
            }

            if (typeof trickleUpdateObject === 'function') {
                return await trickleUpdateObject('journal_entry', journal.objectId, updatedData);
            }

            return await this.updateJournal(journal.objectId, updatedData);
        } catch (error) {
            throw new Error(error.message || 'Failed to like the journal.');
        }
    },
    async updateJournal(id, data) {
        try {
            if (firestore) {
                await firestore.collection('journal_entry').doc(id).update({ objectData: data });
                return { objectId: id, objectData: data };
            }

            if (typeof trickleUpdateObject === 'function') {
                return await trickleUpdateObject('journal_entry', id, data);
            }

            // Local fallback: update localStorage entry
            const arr = JSON.parse(localStorage.getItem('local_journals') || '[]');
            const idx = arr.findIndex(i => i.objectId === id);
            if (idx !== -1) {
                arr[idx] = { ...arr[idx], objectData: { ...arr[idx].objectData, ...data } };
                localStorage.setItem('local_journals', JSON.stringify(arr));
                return arr[idx];
            }
            throw new Error('Local journal not found');
        } catch (error) {
            console.error('API.updateJournal error:', error);
            throw new Error('Failed to update journal.');
        }
    },
    async deleteJournal(id) {
        try {
            if (firestore) {
                await firestore.collection('journal_entry').doc(id).delete();
                return true;
            }

            if (typeof trickleDeleteObject === 'function') {
                return await trickleDeleteObject('journal_entry', id);
            }

            // Local fallback: remove from localStorage array
            const arr = JSON.parse(localStorage.getItem('local_journals') || '[]');
            const newArr = arr.filter(i => i.objectId !== id);
            localStorage.setItem('local_journals', JSON.stringify(newArr));
            return true;
        } catch (error) {
            console.error('API.deleteJournal error:', error);
            throw new Error('Failed to delete journal.');
        }
    }
};
