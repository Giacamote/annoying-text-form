const alphabet = 'abcdefghijklmnñopqrstuvwxyz'.split('');
const loadedDropdowns = new Set();

function generateAlphabetItems(parentId, level = 1) {
  return alphabet.map(letter => {
    const id = `${parentId}-${letter}`;
    return `
      <li class="dd-item dd-container" data-id="${id}" data-level="${level}">
        <a href="#" class="dd-link">${letter} &#9656;</a>
        <ul class="dd-list"><li class="dd-loading">Cargando...</li></ul>
      </li>
    `;
  }).join('');
}

function loadDropdownContent(container) {
  const id = container.dataset.id;
  if (loadedDropdowns.has(id)) return;

  const ul = container.querySelector('.dd-list');
  ul.innerHTML = generateAlphabetItems(id, (parseInt(container.dataset.level) || 1) + 1);
  addEventListeners(ul);
  loadedDropdowns.add(id);
}

function addEventListeners(root) {
  root.querySelectorAll('.dd-container').forEach(c => {
    c.addEventListener('mouseenter', () => loadDropdownContent(c));
  });

  root.querySelectorAll('.dd-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const letter = link.textContent.trim().charAt(0);
      document.getElementById('textbox').value += letter;
    });
  });
}

function initDropdown() {
  const rootList = document.querySelector('.root .dd-list');
  rootList.innerHTML = generateAlphabetItems('root', 1);
  addEventListeners(rootList);
  loadedDropdowns.add('root');
}

document.addEventListener('DOMContentLoaded', initDropdown);
