const alphabet = ['_', ...'abcdefghijklmnñopqrstuvwxyz'];
const loadedDropdowns = new Set();

function generateAlphabetItems(parentId, level = 1) {
  return alphabet.map(letter => {
    const id = `${parentId}-${letter}`;
    return `
      <li class="dd-item dd-container" data-id="${id}" data-level="${level}">
        <a href="#" class="dd-link">${letter} &#9656;</a>
        <ul class="dd-list"></ul>
      </li>
    `;
  }).join('');
}

function loadDropdownContent(container) {
  const id = container.dataset.id;
  if (loadedDropdowns.has(id)) return;

  // Determine path of ancestors
  const path = [];
  let current = container;
  while (current && current.classList.contains('dd-item')) {
    path.unshift(current);
    current = current.parentElement.closest('.dd-item');
  }

  // Close siblings not in path
  container.parentElement.querySelectorAll(':scope > .dd-container').forEach(sib => {
    if (!path.includes(sib)) {
      const sibList = sib.querySelector('.dd-list');
      if (sibList) {
        sibList.innerHTML = '';
        sibList.classList.remove('open');
      }
      loadedDropdowns.forEach(id => {
        if (!path.some(p => p.dataset.id === id) && id !== 'root') loadedDropdowns.delete(id);
      });
    }
  });

  const ul = container.querySelector('.dd-list');
  ul.innerHTML = generateAlphabetItems(id, parseInt(container.dataset.level) + 1);
  loadedDropdowns.add(id);
  ul.classList.add('open');
}

function initDropdown() {
  const rootContainer = document.querySelector('.root');
  const rootList = rootContainer.querySelector('.dd-list');
  const rootButton = rootContainer.querySelector('.dropbtn');
  const textbox = document.getElementById('textbox');

  rootList.innerHTML = generateAlphabetItems('root', 1);
  loadedDropdowns.add('root');

  // Hover → lazy load
  rootList.addEventListener('mouseenter', e => {
    const container = e.target.closest('.dd-container');
    if (container) {
      loadDropdownContent(container);
      const list = container.querySelector('.dd-list');
      list.classList.add('open');
    }
  }, true);

  // Click → add letters
  rootList.addEventListener('click', e => {
    const link = e.target.closest('.dd-link');
    if (!link) return;
    e.preventDefault();

    const chain = [];
    let current = link.closest('.dd-item');
    while (current && current.classList.contains('dd-item')) {
      const letterLink = current.querySelector(':scope > .dd-link');
      if (letterLink) chain.unshift(letterLink.textContent.trim().charAt(0));
      current = current.parentElement.closest('.dd-item');
    }

    textbox.value += chain.join('');

    // Reset dropdowns
    rootList.querySelectorAll('.dd-list').forEach(list => {
      list.innerHTML = '';
      list.classList.remove('open');
    });
    loadedDropdowns.clear();
    loadedDropdowns.add('root');
    rootContainer.classList.remove('open');
  });

  // Position and open dropdown on textarea click
  textbox.addEventListener('click', (e) => {
  e.stopPropagation();

  // Reset the textarea content
  textbox.value = '';

  // Position dropdown near mouse
  const x = e.pageX + 1;
  const y = e.pageY + 1;

  rootContainer.style.left = `${x}px`;
  rootContainer.style.top = `${y}px`;
  rootContainer.classList.add('open');
});


  // Toggle via button (for debug)
  rootButton.addEventListener('click', () => {
    rootContainer.classList.toggle('open');
  });

  // Close when mouse leaves or clicking outside
  rootContainer.addEventListener('mouseleave', () => {
    rootContainer.querySelectorAll('.dd-list').forEach(list => list.classList.remove('open'));
    rootContainer.classList.remove('open');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dd-container.root') && e.target !== textbox) {
      rootContainer.classList.remove('open');
    }
  });
}

document.addEventListener('DOMContentLoaded', initDropdown);
