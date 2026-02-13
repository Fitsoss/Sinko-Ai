import { User } from '../types';

const USERS_KEY = 'sinko_users_db';
const SESSION_KEY = 'sinko_current_session';

export const authService = {
  // Register a new user
  register: (email: string, password: string): User => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: Record<string, any> = usersStr ? JSON.parse(usersStr) : {};

    if (users[email]) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      createdAt: Date.now()
    };

    // Save user + password (in a real app, hash the password!)
    users[email] = { ...newUser, password };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Auto login
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  // Login existing user
  login: (email: string, password: string): User => {
    const usersStr = localStorage.getItem(USERS_KEY);
    const users: Record<string, any> = usersStr ? JSON.parse(usersStr) : {};
    const user = users[email];

    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...safeUser } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return safeUser;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Get current session
  getCurrentUser: (): User | null => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    return sessionStr ? JSON.parse(sessionStr) : null;
  }
};
