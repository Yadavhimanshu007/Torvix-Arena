
import { Tournament, User, Participant } from '../types';

const STORAGE_KEY = 'torvix_arena_data';

interface AppStorage {
  users: Record<string, User>;
  tournaments: Tournament[];
}

const getInitialData = (): AppStorage => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse local storage", e);
    }
  }
  return { users: {}, tournaments: [] };
};

const saveData = (data: AppStorage) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Dispatch a custom event for local tab synchronization
  window.dispatchEvent(new Event('torvix_storage_update'));
};

export const storageService = {
  // User Operations
  async saveUser(user: User) {
    const data = getInitialData();
    data.users[user.id] = user;
    saveData(data);
  },

  async getUser(userId: string): Promise<User | null> {
    const data = getInitialData();
    return data.users[userId] || null;
  },

  // Tournament Operations
  async createTournament(tournament: Tournament) {
    const data = getInitialData();
    data.tournaments.push(tournament);
    saveData(data);
  },

  async updateTournament(tournamentId: string, updates: Partial<Tournament>) {
    const data = getInitialData();
    const index = data.tournaments.findIndex(t => t.id === tournamentId);
    if (index !== -1) {
      data.tournaments[index] = { ...data.tournaments[index], ...updates };
      saveData(data);
    }
  },

  async joinTournamentParticipant(tournamentId: string, participant: Participant) {
    const data = getInitialData();
    const index = data.tournaments.findIndex(t => t.id === tournamentId);
    if (index !== -1) {
      const tournament = data.tournaments[index];
      if (!tournament.participants.some(p => p.userId === participant.userId)) {
        tournament.participants.push(participant);
        saveData(data);
      }
    }
  },

  // Subscription Mock for LocalStorage
  subscribeToTournaments(callback: (tournaments: Tournament[]) => void) {
    const update = () => {
      const data = getInitialData();
      callback(data.tournaments);
    };

    window.addEventListener('torvix_storage_update', update);
    window.addEventListener('storage', update); // For cross-tab sync
    
    // Initial load
    update();

    return () => {
      window.removeEventListener('torvix_storage_update', update);
      window.removeEventListener('storage', update);
    };
  }
};
