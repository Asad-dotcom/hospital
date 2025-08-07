// Local Storage Service to replace API calls
class LocalStorageService {
  constructor() {
    this.initializeMockData();
  }

  // Initialize mock data for local storage
  initializeMockData() {
    if (!localStorage.getItem('users')) {
      const mockUsers = [
        {
          id: 1,
          email: 'admin@hospital.com',
          password: 'admin123',
          role: 'admin',
          name: 'Admin User',
          phone: '1234567890',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          email: 'doctor@hospital.com',
          password: 'doctor123',
          role: 'doctor',
          name: 'Dr. Smith',
          phone: '0987654321',
          specialization: 'Cardiology',
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          email: 'patient@hospital.com',
          password: 'patient123',
          role: 'patient',
          name: 'John Patient',
          phone: '1122334455',
          age: 30,
          bloodGroup: 'O+',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }

    if (!localStorage.getItem('appointments')) {
      localStorage.setItem('appointments', JSON.stringify([]));
    }

    if (!localStorage.getItem('patients')) {
      localStorage.setItem('patients', JSON.stringify([]));
    }

    if (!localStorage.getItem('doctors')) {
      localStorage.setItem('doctors', JSON.stringify([]));
    }
  }

  // Auth methods
  async login(credentials) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password &&
      u.role === credentials.role
    );
    
    if (user) {
      const token = `mock-token-${user.id}-${Date.now()}`;
      localStorage.setItem('token', token);
      return {
        token,
        user: { ...user, password: undefined }
      };
    }
    throw new Error('Invalid credentials');
  }

  async register(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { user: newUser };
  }

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    
    const userId = parseInt(token.split('-')[2]);
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) throw new Error('User not found');
    
    return { ...user, password: undefined };
  }

  logout() {
    localStorage.removeItem('token');
  }

  // User management
  getUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.map(user => ({ ...user, password: undefined }));
  }

  getUser(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === parseInt(id));
    return user ? { ...user, password: undefined } : null;
  }

  createUser(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { ...newUser, password: undefined };
  }

  updateUser(id, userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === parseInt(id));
    
    if (userIndex === -1) throw new Error('User not found');
    
    users[userIndex] = { ...users[userIndex], ...userData };
    localStorage.setItem('users', JSON.stringify(users));
    
    return { ...users[userIndex], password: undefined };
  }

  deleteUser(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = users.filter(u => u.id !== parseInt(id));
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    return true;
  }

  // Generic CRUD operations
  getAll(collection) {
    return JSON.parse(localStorage.getItem(collection) || '[]');
  }

  getById(collection, id) {
    const items = JSON.parse(localStorage.getItem(collection) || '[]');
    return items.find(item => item.id === parseInt(id));
  }

  create(collection, data) {
    const items = JSON.parse(localStorage.getItem(collection) || '[]');
    const newItem = {
      id: Math.max(...items.map(item => item.id), 0) + 1,
      ...data,
      createdAt: new Date().toISOString()
    };
    
    items.push(newItem);
    localStorage.setItem(collection, JSON.stringify(items));
    
    return newItem;
  }

  update(collection, id, data) {
    const items = JSON.parse(localStorage.getItem(collection) || '[]');
    const itemIndex = items.findIndex(item => item.id === parseInt(id));
    
    if (itemIndex === -1) throw new Error('Item not found');
    
    items[itemIndex] = { ...items[itemIndex], ...data };
    localStorage.setItem(collection, JSON.stringify(items));
    
    return items[itemIndex];
  }

  delete(collection, id) {
    const items = JSON.parse(localStorage.getItem(collection) || '[]');
    const filteredItems = items.filter(item => item.id !== parseInt(id));
    localStorage.setItem(collection, JSON.stringify(filteredItems));
    return true;
  }
}

export default new LocalStorageService();
