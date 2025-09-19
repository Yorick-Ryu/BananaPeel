let lastRightClickedElement = null;

// Listen for right-clicks on the document to capture the target element.
// Use capture phase to make sure we get the event before it's stopped by the page's scripts.
document.addEventListener('contextmenu', (event) => {
    lastRightClickedElement = event.target;
}, true);

function addRemoveBackgroundOption(menu) {
    const menuItemContainer = menu.querySelector('[data-testid="image_context_menu"] > div');
    
    if (!menuItemContainer) {
        // Container not found, maybe it renders later. The observer will catch it.
        return;
    }

    // Check if our option is already added to prevent duplicates.
    if (menu.querySelector('.remove-background-option')) {
        return;
    }

    const newMenuItem = document.createElement('div');
    newMenuItem.className = 'context-menu-item-MekMEz remove-background-option';
    newMenuItem.dataset.testid = 'right_click_remove_background';
    
    const textNode = document.createTextNode('去除背景');
    const span = document.createElement('span');
    span.className = 'semi-icon semi-icon-default';
    span.setAttribute('role', 'img');
    // Using a magic-wand-like icon for "Remove Background"
    const iconUrl = chrome.runtime.getURL("icons/icon128.png");
    span.innerHTML = `<img src="${iconUrl}" style="width: 1em; height: 1em; vertical-align: middle;">`;

    newMenuItem.appendChild(span);
    newMenuItem.appendChild(textNode);
    
    newMenuItem.addEventListener('click', (e) => {
        // Let the page handle closing the menu.
        // e.stopPropagation();

        if (lastRightClickedElement && lastRightClickedElement.tagName.toLowerCase() === 'img') {
            const imageUrl = lastRightClickedElement.src;
            chrome.runtime.sendMessage({
                action: "processImage",
                imageUrl: imageUrl
            });
        } else {
            console.debug('The right-clicked element was not an image.');
            alert('The right-clicked element was not an image.');
        }
        
        // // Remove the context menu from the DOM.
        // const portal = newMenuItem.closest('.semi-portal');
        // if(portal) {
        //     portal.remove();
        // }
    }, true);

    menuItemContainer.appendChild(newMenuItem);
}

const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const menu = node.querySelector('.samantha-dropdown-V3IVHj');
                    if(menu){
                        addRemoveBackgroundOption(menu);
                    } else if (node.classList && node.classList.contains('samantha-dropdown-V3IVHj')) {
                        addRemoveBackgroundOption(node);
                    }
                }
            });
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });

console.debug('Doubao content script loaded.');
