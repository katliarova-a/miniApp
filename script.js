const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=300;

const gridRows = 3, gridCols = 4;
const cellSize = 100;
let gameState = Array(gridRows * gridCols).fill(null);
let draggingCat = null, dragStartIndex = null;
dragX = 0, dragY = 0;
let isDragging = false;


function getFreePosition() {
    let freeIndices = gameState.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    return freeIndices.length ? freeIndices[Math.floor(Math.random() * freeIndices.length)] : null;
}

function dropBox() {
    let position = getFreePosition();
    if (position !== null) gameState[position] = { type: "box", timer: Date.now() };
}
function getCellIndex(x, y) { let col = Math.floor(x / cellSize), row = Math.floor(y / cellSize); return row * gridCols + col; }
function updateGameState() {
    gameState.forEach((cell, index) => {
        if (cell?.type === "box" && Date.now() - cell.timer > 3000) {
            gameState[index] = { type: "cat", level: 1 };
        }
    });
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gameState.length; i++) {
        let x = (i % gridCols) * cellSize, y = Math.floor(i / gridCols) * cellSize;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        if (gameState[i]) {
            if (gameState[i].type === "box") ctx.fillStyle = "brown";
            else if (gameState[i].type === "cat") ctx.fillStyle = "gray";
            
            ctx.fillRect(x + 10, y + 10, 80, 80);
            if (gameState[i].type === "cat") {
                ctx.fillStyle = "black";
                ctx.fillText(`Lv ${gameState[i].level}`, x + 30, y + 50);
            }
        }
    }
}

canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("touchstart", startDrag);
function startDrag(event) {
    let x = event.offsetX || event.touches[0].clientX - canvas.offsetLeft;
    let y = event.offsetY || event.touches[0].clientY - canvas.offsetTop;

    let index = getCellIndex(x, y);
    if (gameState[index]?.type === "cat") {
        isDragging = true;
        draggingCat = gameState[index];
        dragStartIndex = index;
        dragX = x;
        dragY = y;
        gameState[dragStartIndex] = null; // Убираем кота с клетки
    }
}

canvas.addEventListener("mousemove", dragMove);
canvas.addEventListener("touchmove", dragMove);
function dragMove(event) {
    if (isDragging) {
        dragX = event.offsetX || event.touches[0].clientX - canvas.offsetLeft;
        dragY = event.offsetY || event.touches[0].clientY - canvas.offsetTop;
        drawGame(); // Перерисовываем, чтобы кот следовал за курсором
    }
}

canvas.addEventListener("mouseup", endDrag);
canvas.addEventListener("touchend", endDrag);
function endDrag(event) {
    if (isDragging) {
        let x = event.offsetX || event.changedTouches[0].clientX - canvas.offsetLeft;
        let y = event.offsetY || event.changedTouches[0].clientY - canvas.offsetTop;
        let index = getCellIndex(x, y);

        if (index !== dragStartIndex && gameState[index]?.type === "cat" && gameState[index].level === draggingCat.level) {
            gameState[index].level++;
        } else {
            gameState[index] = draggingCat;
        }

        draggingCat = null;
        isDragging = false;
        drawGame();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gameState.length; i++) {
        let x = (i % gridCols) * cellSize, y = Math.floor(i / gridCols) * cellSize;
        ctx.fillStyle = "#fff";
        ctx.fillRect(x, y, cellSize, cellSize);
        ctx.strokeRect(x, y, cellSize, cellSize);

        if (gameState[i]) {
            if (gameState[i].type === "box") ctx.fillStyle = "brown"; 
            else if (gameState[i].type === "cat") 
                ctx.fillStyle = "gray"; 
            ctx.fillRect(x + 10, y + 10, 80, 80); 
            if (gameState[i].type === "cat") { 
                ctx.fillStyle = "black"; 
                ctx.fillText(`Lv ${gameState[i].level}`, x + 30, y + 50); 
            } 
        }
    }

    if (draggingCat) {
        ctx.fillStyle = "gray";
        ctx.fillRect(dragX - 40, dragY - 40, 80, 80);
        ctx.fillStyle = "black";
        ctx.fillText(`Lv ${draggingCat.level}`, dragX - 20, dragY);
    }
}

setInterval(() => { updateGameState(); drawGame(); }, 500);
setInterval(dropBox, 5000);

function handleInteraction(event) {
    let x = event.offsetX || event.touches[0].clientX - canvas.offsetLeft;
    let y = event.offsetY || event.touches[0].clientY - canvas.offsetTop;
    
    let index = getCellIndex(x, y);
    if (gameState[index]?.type === "box") {
        gameState[index] = { type: "cat", level: 1 };
    }
    drawGame();
}

canvas.addEventListener("click", handleInteraction);
canvas.addEventListener("touchstart", handleInteraction);

drawGame();
