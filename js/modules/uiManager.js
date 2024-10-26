import { createElement, createButton, showNotification } from '../utils/domUtils.js';
import { CLASSES } from '../utils/constants.js';
import { AIAnalyzer } from './aiAnalyzer.js';
import { InMailAssistant } from './inMailAssistant.js';

export class UIManager {
  static createToolbar() {
    const toolbar = createElement('div', CLASSES.TOOLBAR);
    toolbar.innerHTML = `
      <div class="toolbar-header">
        <h3>LinkedIn Pro Tools</h3>
        <button class="minimize-button">_</button>
      </div>
      <div class="toolbar-content">
        <div class="button-group">
          <button class="pro-button primary" id="analyzeProfile">
            🔍 Analyze Profile
          </button>
          <button class="pro-button" id="aiAnalysis">
            🤖 AI Analysis
          </button>
          <button class="pro-button" id="composeInMail">
            ✉️ Compose InMail
          </button>
          <button class="pro-button" id="exportData">
            💾 Export Data
          </button>
          <button class="pro-button" id="addNotes">
            📝 Add Notes
          </button>
        </div>
        <div class="analysis-section hidden" id="analysisSection">
          <h4>AI Analysis Results</h4>
          <div id="analysisResults"></div>
        </div>
        <div class="inmail-composer hidden" id="inmailComposer">
          <h4>InMail Composer</h4>
          <select id="templateSelect" class="template-select">
            <option value="connection">Connection Request</option>
            <option value="opportunity">Career Opportunity</option>
            <option value="collaboration">Project Collaboration</option>
          </select>
          <textarea id="inmailContent" class="inmail-content" rows="6"></textarea>
          <div class="button-group">
            <button class="pro-button secondary" id="regenerateInMail">
              🔄 Regenerate
            </button>
            <button class="pro-button primary" id="copyInMail">
              📋 Copy to Clipboard
            </button>
          </div>
        </div>
        <div class="skill-section">
          <h4>Skills Analysis</h4>
          <div id="skillsChart"></div>
        </div>
        <div class="quick-actions">
          <button class="pro-button secondary" id="saveContact">
            👥 Save Contact
          </button>
          <button class="pro-button secondary" id="shareProfile">
            📤 Share Profile
          </button>
        </div>
      </div>
    `;

    this.attachToolbarListeners(toolbar);
    return toolbar;
  }

  static async showInMailComposer(profile) {
    const composer = document.getElementById('inmailComposer');
    const templateSelect = document.getElementById('templateSelect');
    const contentArea = document.getElementById('inmailContent');
    
    composer.classList.remove('hidden');
    
    const updateContent = async () => {
      const template = templateSelect.value;
      const inMail = await InMailAssistant.generateInMail(profile, template);
      contentArea.value = inMail.content;
    };

    templateSelect.addEventListener('change', updateContent);
    document.getElementById('regenerateInMail').addEventListener('click', updateContent);
    document.getElementById('copyInMail').addEventListener('click', () => {
      navigator.clipboard.writeText(contentArea.value);
      showNotification('InMail copied to clipboard!');
    });

    await updateContent();
  }

  static attachToolbarListeners(toolbar) {
    toolbar.querySelector('#composeInMail').addEventListener('click', async () => {
      const profile = await this.getCurrentProfile();
      this.showInMailComposer(profile);
    });

    // ... existing listener attachments ...
  }

  // ... rest of the UIManager implementation ...
}