document.addEventListener('DOMContentLoaded', function() {
  const exportButton = document.getElementById('exportProfile');
  const notesTextarea = document.getElementById('notes');
  const saveNotesButton = document.getElementById('saveNotes');

  // Load saved notes for current profile
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = tabs[0].url;
    chrome.storage.local.get(url, function(data) {
      if (data[url]) {
        notesTextarea.value = data[url];
      }
    });
  });

  exportButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "exportProfile"});
    });
  });

  saveNotesButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const url = tabs[0].url;
      const notes = notesTextarea.value;
      chrome.storage.local.set({[url]: notes}, function() {
        saveNotesButton.textContent = 'Saved!';
        setTimeout(() => {
          saveNotesButton.textContent = 'Save Notes';
        }, 2000);
      });
    });
  });
});