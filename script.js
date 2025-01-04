const board = Array(9).fill(null);
let currentPlayer = "X"; // Human plays first
let gameOver = false;
let wins = 0;  // Track the wins
let losses = 0; // Track the losses

// Get DOM elements
const cells = Array.from(document.querySelectorAll('.cell'));
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleClick(index));
});

restartBtn.addEventListener('click', restartGame);

// Function to handle a click on the board
function handleClick(index) {
    if (board[index] || gameOver) return; // Cell already filled or game is over
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    checkWinner();
    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch players
    if (!gameOver && currentPlayer === "O") {
        aiMove(); // AI plays after the human
    }
}

// Function to check for a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            status.textContent = `${board[a]} wins!`;
            status.classList.add("win");
            gameOver = true;
            if (board[a] === "X") wins++; // Human wins
            else losses++; // AI wins
            updateStats();
            return;
        }
    }

    if (!board.includes(null)) {
        status.textContent = "It's a tie!";
        status.classList.add("tie");
        gameOver = true;
    }
}

// AI makes its move
function aiMove() {
    let bestMove = minimax(board, "O");
    board[bestMove] = "O";
    cells[bestMove].textContent = "O";
    checkWinner();
    currentPlayer = "X"; // Switch back to the human player
}

// Minimax algorithm to calculate the best move for AI
function minimax(board, player) {
    const availableMoves = board.map((val, index) => val === null ? index : -1).filter(val => val !== -1);

    if (checkWinnerForPlayer(board, "X")) return -10;
    if (checkWinnerForPlayer(board, "O")) return 10;
    if (availableMoves.length === 0) return 0;

    let bestMove;
    let bestValue = player === "O" ? -Infinity : Infinity;

    for (const move of availableMoves) {
        board[move] = player;
        let boardValue = minimax(board, player === "O" ? "X" : "O");
        board[move] = null;

        if ((player === "O" && boardValue > bestValue) || (player === "X" && boardValue < bestValue)) {
            bestValue = boardValue;
            bestMove = move;
        }
    }
    return bestMove;
}

// Function to check if a player wins
function checkWinnerForPlayer(board, player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of winningCombinations) {
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

// Restart the game
function restartGame() {
    board.fill(null);
    cells.forEach(cell => cell.textContent = "");
    currentPlayer = "X";
    gameOver = false;
    status.textContent = "";
    status.classList.remove("win", "tie");
}

// Update the stats display
function updateStats() {
    winsDisplay.textContent = wins;
    lossesDisplay.textContent = losses;
}
