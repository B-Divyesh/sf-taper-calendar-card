/* global document */
document.querySelector('.skip')?.addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#main')?.focus();
});
