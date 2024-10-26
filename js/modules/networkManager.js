import { STORAGE_KEYS } from '../utils/constants.js';

export class NetworkManager {
  static async saveConnection(profile) {
    const connections = await this.getConnections();
    connections.push({
      ...profile,
      savedAt: new Date().toISOString(),
      tags: [],
      notes: '',
    });

    await chrome.storage.local.set({ [STORAGE_KEYS.CONNECTIONS]: connections });
  }

  static async getConnections() {
    const data = await chrome.storage.local.get(STORAGE_KEYS.CONNECTIONS);
    return data[STORAGE_KEYS.CONNECTIONS] || [];
  }

  static async addNote(profileId, note) {
    const connections = await this.getConnections();
    const connection = connections.find(c => c.id === profileId);
    if (connection) {
      connection.notes = note;
      await chrome.storage.local.set({ [STORAGE_KEYS.CONNECTIONS]: connections });
    }
  }

  static async addTag(profileId, tag) {
    const connections = await this.getConnections();
    const connection = connections.find(c => c.id === profileId);
    if (connection && !connection.tags.includes(tag)) {
      connection.tags.push(tag);
      await chrome.storage.local.set({ [STORAGE_KEYS.CONNECTIONS]: connections });
    }
  }

  static async searchConnections(query) {
    const connections = await this.getConnections();
    return connections.filter(connection => 
      connection.name.toLowerCase().includes(query.toLowerCase()) ||
      connection.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
}