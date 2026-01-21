document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let cross = true;
    let isGameRunning = true;
    let animationDuration = 5;
    const minAnimationDuration = 2.5; // Minimum duration for obstacle animation

    const audio = new Audio('music.mp3');
    const audiogo = new Audio('gameover.mp3');

    // Attempt to play background music on user interaction if autoplay fails
    const startAudio = () => {
        audio.play().catch(error => {
            console.log("Audio play failed (autoplay policy):", error);
        });
        document.removeEventListener('keydown', startAudio);
        document.removeEventListener('click', startAudio);
    };
    document.addEventListener('keydown', startAudio);
    document.addEventListener('click', startAudio);

    // Loop for background music
    audio.loop = true;

    const dino = document.querySelector('.dino');
    const gameOver = document.querySelector('.gameOver');
    const obstacle = document.querySelector('.obstacle');
    const scoreCont = document.querySelector('#scoreCont');
    const restartBtn = document.querySelector('#restartBtn');

    document.onkeydown = function (e) {
        if (!isGameRunning) return;

        console.log("Key code is: ", e.code);

        // Jump
        if (e.code === 'ArrowUp') {
            if (!dino.classList.contains('animateDino')) {
                dino.classList.add('animateDino');
                setTimeout(() => {
                    dino.classList.remove('animateDino');
                }, 800); // Matches CSS animation duration
            }
        }

        // Move Right
        if (e.code === 'ArrowRight') {
            const dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
            const containerWidth = document.querySelector('.gameContainer').offsetWidth;
            if (dinoX < containerWidth - 200) { // Boundary check
                dino.style.left = (dinoX + 112) + "px";
            }
        }

        // Move Left
        if (e.code === 'ArrowLeft') {
            const dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
            if (dinoX > 0) { // Boundary check
                dino.style.left = (dinoX - 112) + "px";
            }
        }
    };

    const gameLoop = setInterval(() => {
        if (!isGameRunning) return;

        const dx = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'));
        const dy = parseInt(window.getComputedStyle(dino, null).getPropertyValue('top')); // Note: Top is calculated relative to container

        const ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
        const oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));

        const offsetX = Math.abs(dx - ox);
        const offsetY = Math.abs(dy - oy);

        // Improved collision detection
        // Dino width ~ 15vw, Height ~ 15vh. Obstacle ~ 10vw.
        // Need to be careful with pixel values as we used vw/vh in CSS.
        // Let's use getBoundingClientRect for more accurate collision.

        const dinoRect = dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        // Simple AABB collision detection
        if (
            dinoRect.left < obstacleRect.right &&
            dinoRect.right > obstacleRect.left &&
            dinoRect.top < obstacleRect.bottom &&
            dinoRect.bottom > obstacleRect.top
        ) {
            // Collision detected
            endGame();
        }
        else if (offsetX < 145 && cross) {
            score += 1;
            updateScore(score);
            cross = false;
            setTimeout(() => {
                cross = true;
            }, 1000);

            // Increase speed (decrease duration)
            setTimeout(() => {
                const aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
                const newDur = Math.max(aniDur - 0.1, minAnimationDuration); // Limit max speed
                obstacle.style.animationDuration = newDur + 's';
                console.log('New animation duration: ', newDur);
            }, 500);
        }
    }, 50); // Increased interval to 50ms for better performance, logic adjusted

    function updateScore(s) {
        scoreCont.textContent = "Your Score: " + s;
    }

    function endGame() {
        gameOver.textContent = "Game Over - Reload to Play Again";
        obstacle.classList.remove('obstacleAni');

        // Freeze positions
        obstacle.style.left = window.getComputedStyle(obstacle).getPropertyValue('left');
        dino.style.animation = 'none';

        audiogo.play();
        audio.pause();

        isGameRunning = false;
        clearInterval(gameLoop);

        restartBtn.style.display = 'block';
    }

    restartBtn.addEventListener('click', () => {
        location.reload(); // Simplest way to restart is to reload
    });
});
