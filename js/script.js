document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let isGameRunning = true;
    let canCollide = false;
    let obstaclePassed = false;
    let hasGameStarted = false;
    const minAnimationDuration = 2.5; // Minimum duration for obstacle animation
    const gameStartGraceMs = 2500;

    const audio = new Audio('assets/audio/music.mp3');
    const audiogo = new Audio('assets/audio/gameover.mp3');

    // Attempt to play background music on user interaction if autoplay fails
    const startAudio = () => {
        startGameIfNeeded();
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
    const gameContainer = document.querySelector('.gameContainer');

    // Keep the obstacle paused until the player starts the game.
    obstacle.style.animationPlayState = 'paused';

    function startGameIfNeeded() {
        if (hasGameStarted || !isGameRunning) {
            return;
        }

        hasGameStarted = true;
        obstacle.style.animationPlayState = 'running';

        // Enable collision checks after a short reaction window.
        setTimeout(() => {
            canCollide = true;
        }, gameStartGraceMs);
    }

    const onKeyDown = (e) => {
        if (!isGameRunning) return;

        startGameIfNeeded();

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
            const dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'), 10);
            const moveStep = Math.max(40, Math.round(gameContainer.offsetWidth * 0.08));
            const maxLeft = gameContainer.offsetWidth - dino.offsetWidth;
            dino.style.left = Math.min(dinoX + moveStep, maxLeft) + 'px';
        }

        // Move Left
        if (e.code === 'ArrowLeft') {
            const dinoX = parseInt(window.getComputedStyle(dino, null).getPropertyValue('left'), 10);
            const moveStep = Math.max(40, Math.round(gameContainer.offsetWidth * 0.08));
            dino.style.left = Math.max(dinoX - moveStep, 0) + 'px';
        }
    };

    document.addEventListener('keydown', onKeyDown);

    const gameLoop = setInterval(() => {
        if (!isGameRunning) return;

        const dinoRect = dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        const dinoCenterX = dinoRect.left + dinoRect.width / 2;
        const obstacleCenterX = obstacleRect.left + obstacleRect.width / 2;

        // Simple AABB collision detection
        const hasCollision =
            dinoRect.left < obstacleRect.right &&
            dinoRect.right > obstacleRect.left &&
            dinoRect.top < obstacleRect.bottom &&
            dinoRect.bottom > obstacleRect.top;

        if (canCollide && hasCollision) {
            // Collision detected
            endGame();
        }
        else if (!obstaclePassed && obstacleCenterX < dinoCenterX) {
            score += 1;
            updateScore(score);
            obstaclePassed = true;

            // Increase speed (decrease duration)
            const aniDur = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
            const newDur = Math.max(aniDur - 0.1, minAnimationDuration); // Limit max speed
            obstacle.style.animationDuration = newDur + 's';
        }

        // Rearm scoring when obstacle returns to the right side for the next cycle.
        if (obstacleRect.left > dinoRect.right + 80) {
            obstaclePassed = false;
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

        audiogo.play().catch(() => {
            // Ignore blocked audio errors caused by browser autoplay policies.
        });
        audio.pause();

        isGameRunning = false;
        clearInterval(gameLoop);
        document.removeEventListener('keydown', onKeyDown);

        restartBtn.style.display = 'block';
    }

    restartBtn.addEventListener('click', () => {
        location.reload(); // Simplest way to restart is to reload
    });
});
