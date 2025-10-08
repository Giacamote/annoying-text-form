const alphabet = 'abcdefghijklmnñopqrstuvwxyz'.split('');
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

  const ul = container.querySelector('.dd-list');
  ul.innerHTML = generateAlphabetItems(id, (parseInt(container.dataset.level) || 1) + 1);
  loadedDropdowns.add(id);
}

function initDropdown() {
  const rootContainer = document.querySelector('.root');
  const rootList = rootContainer.querySelector('.dd-list');
  const rootButton = rootContainer.querySelector('.dropbtn');

  rootList.innerHTML = generateAlphabetItems('root', 1);
  loadedDropdowns.add('root');

  // Event delegation for hover to lazy-load
  rootList.addEventListener('mouseenter', e => {
    const container = e.target.closest('.dd-container');
    if (container) {
      loadDropdownContent(container);
      const list = container.querySelector('.dd-list');
      list.classList.add('open');
    }
  }, true); // capture phase

  // Event delegation for clicks on letters
  rootList.addEventListener('click', e => {
    const link = e.target.closest('.dd-link');
    if (!link) return;

    e.preventDefault();

    const textbox = document.getElementById('textbox');

    // grab the letters
    const chain = [];
    let current = link.closest('.dd-item');
    while (current && current.classList.contains('dd-item')) {
      const letterLink = current.querySelector(':scope > .dd-link');
      if (letterLink) chain.unshift(letterLink.textContent.trim().charAt(0));
      current = current.parentElement.closest('.dd-item');
    }

    textbox.value += chain.join('');

    // erase nested dropdowns
    rootList.querySelectorAll('.dd-list').forEach(list => {
      list.innerHTML = '';
      list.classList.remove('open');
    });

    // reset loadedDropdowns except root
    loadedDropdowns.forEach(id => {
      if (id !== 'root') loadedDropdowns.delete(id);
    });

    // close root dropdown
    rootContainer.classList.remove('open');
  });

//   // Toggle root dropdown on button click
//   rootButton.addEventListener('click', () => {
//     rootContainer.classList.toggle('open');
//   });

  // Optional: close root dropdown when mouse leaves
  rootContainer.addEventListener('mouseleave', () => {
    rootContainer.classList.remove('open');
  });
}

document.addEventListener('DOMContentLoaded', initDropdown);
