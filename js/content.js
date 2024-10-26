import { ProfileExtractor } from './modules/profileExtractor.js';
import { SkillAnalyzer } from './modules/skillAnalyzer.js';
import { NetworkManager } from './modules/networkManager.js';
import { UIManager } from './modules/uiManager.js';

class LinkedInEnhancer {
  constructor() {
    this.initialize();
  }

  async initialize() {
    if (!this.isProfilePage()) return;
    
    this.initializeUI();
    this.attachMessageListeners();
    await this.loadUserPreferences();
  }

  isProfilePage() {
    return window.location.href.includes('linkedin.com/in/');
  }

  initializeUI() {
    const toolbar = UIManager.createToolbar();
    document.body.appendChild(toolbar);
  }

  attachMessageListeners() {
    chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
      switch (request.action) {
        case 'exportProfile':
          await this.handleExportProfile();
          break;
        case 'analyzeProfile':
          await this.handleProfileAnalysis();
          break;
        case 'saveNote':
          await this.handleSaveNote(request.data);
          break;
      }
    });
  }

  async handleExportProfile() {
    try {
      const profile = await ProfileExtractor.extractProfile();
      const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.name.replace(/\s+/g, '_')}_linkedin_profile.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  async handleProfileAnalysis() {
    try {
      const profile = await ProfileExtractor.extractProfile();
      const analysis = SkillAnalyzer.analyzeSkills(profile.skills);
      UIManager.showAnalysisResults(analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  }

  async handleSaveNote(data) {
    try {
      await NetworkManager.addNote(data.profileId, data.note);
      UIManager.showNotification('Note saved successfully!');
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  }

  async loadUserPreferences() {
    const preferences = await chrome.storage.local.get('userPreferences');
    if (preferences.userPreferences) {
      this.applyUserPreferences(preferences.userPreferences);
    }
  }

  applyUserPreferences(preferences) {
    if (preferences.autoAnalyze) {
      this.handleProfileAnalysis();
    }
    if (preferences.theme) {
      document.body.setAttribute('data-theme', preferences.theme);
    }
  }
}

// Initialize the enhancer
new LinkedInEnhancer();