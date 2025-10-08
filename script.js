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
function addHoverListeners(container) {
  container.querySelectorAll('.dd-item.dd-container').forEach(item => {
    item.addEventListener('mouseenter', () => {
      loadDropdownContent(item);
      const list = item.querySelector('.dd-list');
      list.classList.add('open');
    });
  });
}

function loadDropdownContent(container) {
  const id = container.dataset.id;
  if (loadedDropdowns.has(id)) return;

  // Determine the path of ancestors (from root to this container)
  const path = [];
  let current = container;
  while (current && current.classList.contains('dd-item')) {
    path.unshift(current);
    current = current.parentElement.closest('.dd-item');
  }

  // Close all sibling dropdowns not in the path
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

  // Lazy-load the hovered container
  const ul = container.querySelector('.dd-list');
  ul.innerHTML = generateAlphabetItems(id, parseInt(container.dataset.level) + 1);
  loadedDropdowns.add(id);
  ul.classList.add('open');
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

rootButton.addEventListener('click', () => {
  rootContainer.classList.toggle('open');
});

// Close everything when leaving the root container
rootContainer.addEventListener('mouseleave', () => {
  rootContainer.querySelectorAll('.dd-list').forEach(list => list.classList.remove('open'));
  rootContainer.classList.remove('open');
});
}

document.addEventListener('DOMContentLoaded', initDropdown);
