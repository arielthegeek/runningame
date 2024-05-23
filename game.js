const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let runner = {
    x: 50,
    y: canvas.height - 60,
    width: 100, // Adjusted width to make it wider
    height: 60,
    dy: 0,
    gravity: 0.8,
    jumpPower: -15,
    grounded: false,
    image: new Image()
};

runner.image.src = 'cringe.png'; // Set the source of the image

let cactus = {
    x: canvas.width,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 6,
    image: new Image()
};

cactus.image.src = 'obst.png'; // Set the source of the image

let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
let gameOver = false;
let showGameOverScreen = true;
let gameOverSubtitle = "Sigma!";
let specialMessage = "";
let speedIncreaseInterval;
let obstacleSpeed = 6;

const specialMessages = ["Sigma!", "You are so skibidi!"];

document.addEventListener('keydown', (e) => {
    if (gameOver && e.code === 'Space') {
        restartGame();
    } else if (e.code === 'Space' && runner.grounded) {
        runner.dy = runner.jumpPower;
        runner.grounded = false;
    }
});

function restartGame() {
    score = 0;
    runner.y = canvas.height - 60;
    runner.dy = 0;
    cactus.x = canvas.width;
    gameOver = false;
    showGameOverScreen = true;
    gameOverSubtitle = "Your are no longer Sigma";
    specialMessage = "";
    obstacleSpeed = 6;
    clearInterval(speedIncreaseInterval);
    startGame();
}

function showOpeningScreen() {
    const openingScreen = document.getElementById('opening');
    setTimeout(() => {
        openingScreen.innerHTML = '<h1>Coded by Ariel Saks</h1>'; // Display "Coded by Ariel Saks"
        setTimeout(() => {
            openingScreen.innerHTML = '<h1>Introducing Skibidi Runner</h1><p>Brought to you by Ariel Games Inc</p>'; // Display "Introducing Skibidi Runner"
            setTimeout(() => {
                openingScreen.innerHTML = '<img id="logo" src="logo.ico" alt="Logo">'; // Display the logo
                openingScreen.innerHTML += '<canvas id="gameCanvas" width="800" height="400"></canvas>'; // Add the canvas
                
                // Set the size of the logo
                const logo = document.getElementById('logo');
                logo.style.width = '200px'; // Adjust the width as needed
                logo.style.height = '200px'; // Adjust the height as needed

                setTimeout(() => {
                    openingScreen.style.display = 'none'; // Hide the opening screen after showing the logo for 2 seconds
                    startGame(); // Start the game
                }, 2000);
            }, 5000); // Display the logo after 5 seconds of showing "Introducing Skibidi Runner"
        }, 5000); // Display "Introducing Skibidi Runner" after 5 seconds of showing "Coded by Ariel Saks"
    }, 5000); // Display "Coded by Ariel Saks" for the first 5 seconds
}


function drawSpecialMessage() {
    ctx.fillStyle = 'blue'; // Change the color here if needed
    ctx.font = '24px Arial';
    ctx.fillText(specialMessage, canvas.width / 2 - 120, canvas.height / 2 + 80); // Adjust position as needed
}

function updateSpeed() {
    obstacleSpeed += 0.1; // Increase obstacle speed
}

function saveHighscore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
    }
}

function startSpeedIncrease() {
    speedIncreaseInterval = setInterval(updateSpeed, 5000); // Increase speed every 5 seconds
}

function startGame() {
    startSpeedIncrease(); // Start increasing speed
    function update() {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update Runner
            runner.y += runner.dy;
            runner.dy += runner.gravity;

            if (runner.y + runner.height > canvas.height - 20) {
                runner.y = canvas.height - runner.height - 20;
                runner.dy = 0;
                runner.grounded = true;
            }

            // Update Cactus
            cactus.x -= obstacleSpeed;
            if (cactus.x + cactus.width < 0) {
                cactus.x = canvas.width;
                score++;
                if (score % 15 === 0) {
                    const randomIndex = Math.floor(Math.random() * specialMessages.length);
                    specialMessage = specialMessages[randomIndex];
                    setTimeout(() => {
                        specialMessage = "";
                    }, 3000); // Clear the message after 3 seconds
                }
            }

            // Check collision
// Check collision with buffer
const buffer = 5; // Adjust the buffer size as needed
if (
    runner.x < cactus.x + cactus.width - buffer &&
    runner.x + runner.width - buffer > cactus.x &&
    runner.y < cactus.y + cactus.height - buffer &&
    runner.y + runner.height - buffer > cactus.y
) {
    gameOver = true;
}




            // Draw Runner
            ctx.drawImage(runner.image, runner.x, runner.y, runner.width, runner.height);

            // Draw Cactus
            ctx.drawImage(cactus.image, cactus.x, cactus.y, cactus.width, cactus.height);

            // Draw Ground
            ctx.fillStyle = 'brown';
            ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

            // Draw Score
            ctx.fillStyle = 'white';
            ctx.font = '24px Arial';
            ctx.fillText(`Score: ${score}`, 10, 30);

            if (gameOver && showGameOverScreen) {
                ctx.fillStyle = 'red';
                ctx.font = '48px Arial';
                ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
                ctx.font = '24px Arial';
                ctx.fillText(`Your are no longer Sigma`, canvas.width / 2 - 120, canvas.height / 2 + 40);
                ctx.fillText(`Highscore: ${highscore}`, canvas.width / 2 - 120, canvas.height / 2 + 80);
                showGameOverScreen = false;
                saveHighscore();
            }

            if (specialMessage !== "") {
                drawSpecialMessage();
            }

            requestAnimationFrame(update);
        }
    }

    update();
}

showOpeningScreen();