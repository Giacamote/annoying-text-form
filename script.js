function createNestedAlphabet(levels = 1) {
    if (levels <= 0) return '';
    
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z'];
    
    let html = `<ul class="dd-list">`;
    
    alphabet.forEach(letter => {
        if (levels > 1) {
            html += `
                <li class="dd-item dd-container">
                    <a href="#" class="dd-link">${letter} &#9656;</a>
                    ${createNestedAlphabet(levels - 1)}
                </li>
            `;
        } else {
            html += `
                <li class="dd-item">
                    <a href="#" class="dd-link">${letter}</a>
                </li>
            `;
        }
    });
    
    html += `</ul>`;
    return html;
}

function initNestedDropdowns() {
    // Add nested structure to all dropdown containers
    const dropdownContainers = document.querySelectorAll('.dd-item.dd-container');
    
    dropdownContainers.forEach(container => {
        if (!container.querySelector('.dd-list')) {
            container.innerHTML += createNestedAlphabet(3); // 2 levels of nesting
        }
    });
}

document.addEventListener('DOMContentLoaded', initNestedDropdowns);