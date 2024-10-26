// Add enhancement toolbar to profile
function addEnhancementToolbar() {
  const toolbar = document.createElement('div');
  toolbar.className = 'linkedin-enhancer-toolbar';
  toolbar.innerHTML = `
    <div class="toolbar-content">
      <button id="quickSave">🔖 Quick Save</button>
      <button id="addNote">📝 Add Note</button>
      <button id="highlightSkills">✨ Highlight Skills</button>
    </div>
  `;
  document.body.appendChild(toolbar);

  // Event listeners for toolbar buttons
  document.getElementById('quickSave').addEventListener('click', saveProfile);
  document.getElementById('addNote').addEventListener('click', showNoteDialog);
  document.getElementById('highlightSkills').addEventListener('click', highlightKeySkills);
}

// Extract profile data
function extractProfileData() {
  const profileData = {
    name: document.querySelector('h1')?.textContent?.trim() || '',
    headline: document.querySelector('.pv-text-details__left-panel')?.textContent?.trim() || '',
    location: document.querySelector('.pv-text-details__left-panel .text-body-small')?.textContent?.trim() || '',
    about: document.querySelector('.pv-shared-text-with-see-more')?.textContent?.trim() || '',
    experience: Array.from(document.querySelectorAll('.experience-section .pv-entity__summary-info'))
      .map(exp => ({
        title: exp.querySelector('h3')?.textContent?.trim() || '',
        company: exp.querySelector('.pv-entity__secondary-title')?.textContent?.trim() || '',
        duration: exp.querySelector('.pv-entity__date-range span:nth-child(2)')?.textContent?.trim() || ''
      }))
  };
  return profileData;
}

// Save profile data as JSON
function saveProfile() {
  const profileData = extractProfileData();
  const blob = new Blob([JSON.stringify(profileData, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${profileData.name.replace(/\s+/g, '_')}_linkedin_profile.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Show note dialog
function showNoteDialog() {
  const dialog = document.createElement('div');
  dialog.className = 'note-dialog';
  dialog.innerHTML = `
    <div class="note-dialog-content">
      <textarea placeholder="Add your notes here..."></textarea>
      <button>Save Note</button>
    </div>
  `;
  document.body.appendChild(dialog);

  dialog.querySelector('button').addEventListener('click', () => {
    const note = dialog.querySelector('textarea').value;
    chrome.storage.local.set({
      [window.location.href]: note
    });
    dialog.remove();
  });
}

// Highlight key skills
function highlightKeySkills() {
  const skills = document.querySelectorAll('.pv-skill-category-entity__name-text');
  skills.forEach(skill => {
    skill.style.backgroundColor = '#f0f7ff';
    skill.style.padding = '2px 5px';
    skill.style.borderRadius = '3px';
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "exportProfile") {
    saveProfile();
  }
});

// Initialize enhancement features
if (window.location.href.includes('linkedin.com/in/')) {
  addEnhancementToolbar();
}