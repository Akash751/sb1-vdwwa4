export const createElement = (tag, className, innerHTML = '') => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (innerHTML) element.innerHTML = innerHTML;
  return element;
};

export const createButton = (text, onClick, icon = '') => {
  const button = createElement('button', 'pro-button');
  button.innerHTML = `${icon} ${text}`;
  button.addEventListener('click', onClick);
  return button;
};

export const showNotification = (message, type = 'success') => {
  const notification = createElement('div', `notification ${type}`);
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};