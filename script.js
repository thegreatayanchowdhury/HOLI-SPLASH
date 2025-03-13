const gameContainer = document.getElementById('game-container');
const splashSound = document.getElementById('splash-sound');
const washSound = document.getElementById('wash-sound');
const washButton = document.getElementById('wash-button');

const colors = ['#FF5733', '#FFC300', '#FF33FF', '#33FF57', '#33A1FF', '#A133FF',
'#FF3333', '#FFFF33', '#FF8C33', '#33FFBD', '#FF33A1', '#B833FF'];

gameContainer.addEventListener('click', (event) => {
    if (event.target === washButton) return;

    const x = event.clientX;
    const y = event.clientY;

    throwBalloon(x, y);
});

function throwBalloon(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Create the balloon element
    const balloon = document.createElement('div');
    balloon.classList.add('balloon');
    balloon.style.backgroundColor = color;
    balloon.style.left = `${x}px`;
    balloon.style.bottom = `-100px`;

    gameContainer.appendChild(balloon);

    // Calculate curve for projectile motion
    const midX = (x + window.innerWidth / 2) / 2;
    const midY = y - 200;

    balloon.animate(
        [
            { transform: `translate(${midX - x}px, -300px)`, offset: 0.3 },
            { transform: `translate(0, ${y - window.innerHeight}px)` }
        ],
        {
            duration: 700,
            easing: 'ease-out',
            fill: 'forwards'
        }
    ).onfinish = () => {
        balloon.remove();
        createSplash(x, y, color);
        splashSound.currentTime = 0;
        splashSound.play();
    };
}

function createSplash(x, y, color) {
    for (let i = 0; i < 40; i++) {
        createDroplet(x, y, color, true);
    }

    for (let i = 0; i < 80; i++) {
        createDroplet(x, y, color, false);
    }
}

function createDroplet(x, y, color, isCentral) {
    const droplet = document.createElement('div');
    droplet.classList.add('splash-droplet');
    droplet.style.backgroundColor = color;

    const size = isCentral ? Math.random() * 15 + 5 : Math.random() * 10 + 3;
    droplet.style.width = `${size}px`;
    droplet.style.height = `${size}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = isCentral ? Math.random() * 30 : Math.random() * 200;

    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;

    droplet.style.left = `${x + offsetX}px`;
    droplet.style.top = `${y + offsetY}px`;

    gameContainer.appendChild(droplet);
}

washButton.addEventListener('click', () => {
    washSound.currentTime = 0;
    washSound.play();

    // Create water stream
    createWaterStream();
});

function createWaterStream() {
    const waterStream = document.createElement('div');
    waterStream.classList.add('water-stream');
    gameContainer.appendChild(waterStream);

    // Start water stream animation
    waterStream.animate(
        [
            { top: '-100%', opacity: 0.8 },
            { top: '100%', opacity: 0.3 }
        ],
        {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        }
    ).onfinish = () => {
        // Clean the screen after stream finishes
        document.querySelectorAll('.splash-droplet').forEach((splash) => splash.remove());
        gameContainer.style.backgroundColor = 'white';

        setTimeout(() => {
            waterStream.remove();
            washButton.style.backgroundColor = 'white';
            washButton.style.pointerEvents = 'auto';
        }, 100);
    };
}
