// Class to represent the game logic
class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.players = [];
    this.currPlayer = null;
    this.gameOver = true;
    this.startGame();
  }

  // Method to create the game board
  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  // Method to create the HTML structure of the board
  makeHtmlBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // Create the main board rows and cells
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  // Method to start/restart the game
  startGame() {
    // Get the start button from HTML.
    const startBtn = document.getElementById("start-button");

    // Add event listener to start/restart game if start game is clicked.
    startBtn.addEventListener("click", () => {
      const player1Color = document.getElementById("player1").value.trim();
      const player2Color = document.getElementById("player2").value.trim();

      // Assign players with the provided colors
      this.players = [new Player(player1Color), new Player(player2Color)];
      this.currPlayer = this.players[0];

      // Start a new game
      this.gameOver = false;
      this.makeBoard();
      this.makeHtmlBoard();
    });
  }

  // Method to find the next available spot in a column
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  // Method to place a piece on the board
  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  // Method to end the game
  endGame(msg) {
    alert(msg);
    this.gameOver = true;
  }

  // Method to handle column clicks
  handleClick(evt) {
    if (!this.gameOver) {
      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        return this.endGame(`The ${this.currPlayer.color} player won!`);
      }

      // check for tie
      if (this.board.every((row) => row.every((cell) => cell))) {
        return this.endGame("Tie!");
      }

      // switch players
      this.currPlayer =
        this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }
  }

  // Method to check for a win
  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

// Class to represent a player
class Player {
  constructor(colorName) {
    this.color = colorName;
  }
}

// Initialize a new game with a 6x7 board
new Game(6, 7);
