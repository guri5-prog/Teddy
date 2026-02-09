document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const introContainer = document.getElementById('intro-container');
    const messageText = document.getElementById('message-text');
    const giftButton = document.getElementById('gift-button');
    const teddyZone = document.getElementById('teddy-zone');
    const controls = document.getElementById('controls');
    const addTeddyBtn = document.getElementById('add-teddy-btn');

    // Message Data
    const message = "Hey Love, \n\nYou mean everything to me. ❤️\nI know Teddy Day is a special day, and I really wanted to get you the biggest, fluffiest teddy bear. \nBut I couldn't make that happen this time. 😔 \nBut I promise, next time, I'll get you a real one! \n\nUntil then, I made something special just for you...";

    // Typewriter Effect
    let charIndex = 0;
    function typeWriter() {
        if (charIndex < message.length) {
            const char = message.charAt(charIndex);
            if (char === '\n') {
                messageText.innerHTML += '<br>';
            } else {
                messageText.innerHTML += char;
            }
            charIndex++;
            setTimeout(typeWriter, 50); // Adjust speed here
        } else {
            // Show button after typing finishes
            setTimeout(() => {
                giftButton.classList.remove('hidden');
                giftButton.style.animation = 'fadeIn 1s forwards';
            }, 500);
        }
    }

    // Start typing after a short delay
    setTimeout(typeWriter, 1000);

    // Gift Button Click
    giftButton.addEventListener('click', () => {
        introContainer.classList.add('fade-out');
        setTimeout(() => {
            introContainer.style.display = 'none';
            // Start recursive teddy creation
            createTeddyRecursive(window.innerWidth / 2 - 100, window.innerHeight / 2 - 120);

            // Show controls after a delay
            setTimeout(() => {
                controls.classList.remove('hidden');
            }, 4000);
        }, 1000);
    });

    // Add Toy Buttons
    const buttonGroup = document.querySelector('.button-group');
    buttonGroup.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-secondary')) {
            const type = e.target.getAttribute('data-type');
            const x = Math.random() * (window.innerWidth - 250) + 25;
            const y = Math.random() * (window.innerHeight - 300) + 25;
            createTeddyRecursive(x, y, type);
        }
    });

    // Recursive Toy Creation
    function createTeddyRecursive(x, y, type = 'teddy') {
        const toy = document.createElement('div');

        // Base class + specific type class
        if (type === 'teddy') toy.classList.add('teddy-bear');
        else if (type === 'bunny') toy.classList.add('bunny-toy');
        else if (type === 'panda') toy.classList.add('panda-toy');
        else toy.classList.add('teddy-bear'); // fallback

        toy.style.left = `${x}px`;
        toy.style.top = `${y}px`;

        // Base Parts
        const parts = [
            { class: 'leg-l', delay: 100 },
            { class: 'leg-r', delay: 200 },
            { class: 'paw', parent: 'leg-l', delay: 10 },
            { class: 'paw', parent: 'leg-r', delay: 10 },
            { class: 'arm-l', delay: 300 },
            { class: 'arm-r', delay: 400 },
            { class: 'body', delay: 500 },
            { class: 'belly', parent: 'body', delay: 100 },
            { class: 'ear-l', delay: 600 },
            { class: 'ear-r', delay: 700 },
            { class: 'ear-inner', parent: 'ear-l', delay: 10 },
            { class: 'ear-inner', parent: 'ear-r', delay: 10 },
            { class: 'head', delay: 800 },
            { class: 'face-area', parent: 'head', delay: 200 },
        ];

        // Type Specific Additions (Insert before facial features)
        if (type === 'panda') {
            parts.push({ class: 'eye-patch left', parent: 'head', delay: 250 });
            parts.push({ class: 'eye-patch right', parent: 'head', delay: 250 });
        }

        // Common Facial Features
        parts.push(
            { class: 'eye-l', parent: 'head', delay: 300 },
            { class: 'eye-r', parent: 'head', delay: 300 },
            { class: 'nose', parent: 'head', delay: 400 },
            { class: 'mouth', parent: 'head', delay: 500 },
            { class: 'cheek-l', parent: 'head', delay: 550 },
            { class: 'cheek-r', parent: 'head', delay: 550 }
        );

        teddyZone.appendChild(toy);

        // Make draggable immediately
        makeDraggable(toy);

        // Recursive function to append parts
        let i = 0;

        function appendNextPart() {
            if (i >= parts.length) return;

            const partInfo = parts[i];
            const partEl = document.createElement('div');

            // Handle multiple classes (e.g., "eye-patch left")
            partEl.className = `teddy-part visible`;
            const classes = partInfo.class.split(' ');
            classes.forEach(c => partEl.classList.add(c));

            partEl.style.animation = 'popUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

            let parentEl = toy;
            if (partInfo.parent) {
                // Find already created parent in the toy's current children
                const potentialParent = toy.querySelector(`.${partInfo.parent.split(' ')[0]}`); // Use first class for query
                if (potentialParent) {
                    parentEl = potentialParent;
                }
            }

            parentEl.appendChild(partEl);

            i++;
            setTimeout(appendNextPart, partInfo.delay || 200);
        }

        appendNextPart();
    }

    // Drag and Drop Logic
    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY;
        let initialLeft, initialTop;

        element.addEventListener('mousedown', startDrag);
        element.addEventListener('touchstart', startDrag, { passive: false });

        function startDrag(e) {
            isDragging = true;

            const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;

            startX = clientX;
            startY = clientY;

            // Get current computed style values
            const style = window.getComputedStyle(element);
            initialLeft = parseFloat(style.left);
            initialTop = parseFloat(style.top);

            // Bring to front
            bringToFront(element);

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', stopDrag);
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault(); // Prevent scrolling on touch

            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

            const dx = clientX - startX;
            const dy = clientY - startY;

            element.style.left = `${initialLeft + dx}px`;
            element.style.top = `${initialTop + dy}px`;
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', stopDrag);
        }
    }

    let maxZ = 10;
    function bringToFront(el) {
        maxZ++;
        el.style.zIndex = maxZ;
    }
});
