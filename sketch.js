let actions

let board;
let currentPlayer = 'X';
let prev_actions = []

let currAssumption = 0;
let assumption_stats_0;
let assumption_stats_1;
let assumption_stats_minmax;

function extract_stats(prev_actions) {
    let num_p1_wins = 0;
    let num_p2_wins = 0;
    let num_tie = 0
    if (actions != null) {
        for (let i = 0; i < actions.length; i++) {

            let curr_action = actions[i]

            //check only the scenario with the same previous actions of the current situation
            if (!equalsCheck(curr_action[0].slice(0, prev_actions.length), prev_actions)) {
                continue;
            }

            // if (curr_action[0].length == prev_actions.length) {
            //     if (curr_action[1] == 'P1')
            //         return [Infinity, 0, 0];
            //
            //     if (curr_action[1] == 'P2')
            //         return [0, Infinity, 0];
            //
            //     if (curr_action[1] == 'tie')
            //         return [0, 0, Infinity];
            // }
            if (curr_action[1] == 'P1')
                num_p1_wins += 1;
            if (curr_action[1] == 'P2')
                num_p2_wins += 1;
            if (curr_action[1] == 'tie')
                num_tie += 1;
        }
    }
    // console.log(num_p1_wins + " " + num_p2_wins + " " + num_tie)
    return [num_p1_wins, num_p2_wins, num_tie];
}

// A function to compare two arrays in javascript
const equalsCheck = (a, b) =>
    a.length === b.length &&
    a.every((v, i) => v === b[i]);

function setup() {

    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    createCanvas(800, 800);

    loadJSON('actions.json', function (data) {
            actions = data
            extract_stats(prev_actions);
            noLoop();

            redraw();
        }
    );


}

function changeAssumption() {
    console.log("changeAssumption")

    currAssumption = ((currAssumption + 1) % assumptionTexts.length)
    // console.log(currAssumption)

    redraw();
}

function draw() {
    background(0);
    textAlign(LEFT, LEFT);
    stroke(0)
    textSize(25);

    fill(255, 255, 255);

    calculateStats()
    draw_grid(width, height)
}

function calculateStats() {

    no_assumption_stats = [];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let spot = board[row][col];
            if (spot != 'O' && spot != 'X') {
                no_assumption_stats.push(extract_stats([...prev_actions, get_pos(col, row)]));
            } else {
                no_assumption_stats.push([]);
            }
        }
    }


    assumption_stats_0 = [];
    assumption_stats_1 = [];

    let availableMoves = []
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let spot = board[row][col];
            if (spot != 'O' && spot != 'X') {
                availableMoves.push(get_pos(col, row))
            }
        }
    }


    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let spot = board[row][col];
            if (spot != 'O' && spot != 'X') {
                let bestStats0 = null;
                let bestStats1 = null;
                let best_value_0 = null;
                let best_value_1 = null;
                let currPos = get_pos(col, row);
                for (let z = 0; z < availableMoves.length; z++) {
                    if (currPos != availableMoves[z]) {
                        let currStats = extract_stats([...prev_actions, currPos, availableMoves[z]]);
                        let curr_win = ((currentPlayer == 'X') ? currStats[1] : currStats[0]);
                        let curr_lose = ((currentPlayer == 'X') ? currStats[0] : currStats[1]);
                        let curr_tot = currStats[0] + currStats[1] + currStats[2];
                        let curr_value_0 = (curr_win) / curr_tot;
                        let curr_value_1 = (curr_win + currStats[2]) / curr_tot;

                        if (curr_tot != 0) {

                            if (bestStats0 == null || curr_value_0 > best_value_0) {
                                bestStats0 = currStats;
                                best_value_0 = curr_value_0;
                            }
                            if (bestStats1 == null || curr_value_1 > best_value_1) {
                                bestStats1 = currStats;
                                best_value_1 = curr_value_1;
                            }
                        }
                    }
                }
                if (bestStats0 != null) {
                    assumption_stats_0.push(bestStats0);
                } else {
                    //last move case
                    assumption_stats_0.push(extract_stats([...prev_actions, get_pos(col, row)]));
                }
                if (bestStats1 != null) {
                    assumption_stats_1.push(bestStats1);
                } else {
                    //last move case
                    assumption_stats_1.push(extract_stats([...prev_actions, get_pos(col, row)]));
                }

            } else {
                assumption_stats_0.push([]);
                assumption_stats_1.push([]);
            }
        }
    }

    assumption_stats_minmax = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {

            if (board[row][col] === '') {
                let score
                if (currentPlayer == 'O') {
                    board[row][col] = 'O';
                    score = minimax(board, 0, false);
                    board[row][col] = '';
                } else {
                    board[row][col] = 'X';
                    score = minimax(board, 0, true);
                    board[row][col] = '';
                }
                assumption_stats_minmax.push(score);

            } else {
                assumption_stats_minmax.push([]);
            }
        }
    }

}

function draw_grid(grid_width, grid_height) {
    textAlign(CENTER, CENTER);
    let w = grid_width / 3;
    let h = grid_height / 3;
    strokeWeight(4);
    stroke(255, 255, 255)
    // Disegna griglia
    for (let i = 1; i < 3; i++) {
        line(i * w, 0, i * w, grid_height);
        line(0, i * h, grid_width, i * h);
    }

    // Disegna X e O
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            let x = col * w + w / 2;
            let y = row * h + h / 2;
            let spot = board[row][col];

            if (spot == 'O') {
                noFill();
                stroke(255, 0, 0)
                ellipse(x, y, w / 2);
            } else if (spot == 'X') {
                stroke(0, 255, 0)
                line(x - w / 4, y - h / 4, x + w / 4, y + h / 4);
                line(x + w / 4, y - h / 4, x - w / 4, y + h / 4);
            } else {
                fill(0);
                stroke(0)
                if (currentPlayer == 'X') {
                    // stroke(0,255,0)
                    fill(0, 255, 0);
                } else {
                    // stroke(255,0,0)
                    fill(255, 0, 0);
                }
                let assumption_stat_0 = assumption_stats_0[get_pos(col, row) - 1]
                let assumption_stat_1 = assumption_stats_1[get_pos(col, row) - 1]
                let assumption_stat_minmax = assumption_stats_minmax[get_pos(col, row) - 1]
                let no_assumption_stat = no_assumption_stats[get_pos(col, row) - 1]

                let curr_value_0 = ((currentPlayer == 'X') ? assumption_stat_0[0] : assumption_stat_0[1]) / (assumption_stat_0[0] + assumption_stat_0[1] + assumption_stat_0[2]);
                let curr_value_1 = (((currentPlayer == 'X') ? assumption_stat_1[0] : assumption_stat_1[1]) + assumption_stat_1[2]) / (assumption_stat_1[0] + assumption_stat_1[1] + assumption_stat_1[2]);

                textSize(16);
                text(
                    "# possible ends\nX: " + no_assumption_stat[0] + " - O: " + no_assumption_stat[1] + " - tie: " + no_assumption_stat[2] +
                    "\n\nwith assumption 0\nX: " + assumption_stat_0[0] + " - O: " + assumption_stat_0[1] + " - tie: " + assumption_stat_0[2] + "(" + (curr_value_0 * 100).toFixed(2) + "%)" +
                    "\nwith assumption 1\nX: " + assumption_stat_1[0] + " - O: " + assumption_stat_1[1] + " - tie: " + assumption_stat_1[2] + "(" + (curr_value_1 * 100).toFixed(2) + "%)" +
                    "\nwith minmax\nX: " + assumption_stat_minmax.score, x, y + h / 12);
            }
        }
    }
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        if (result === 'X wins!') {
            return {score: -1};
        } else if (result === 'O wins!') {
            return {score: 1};
        } else {
            return {score: 0};
        }
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        let move = {score: bestScore};

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    board[row][col] = 'O';
                    let score = minimax(board, depth + 1, false).score;
                    board[row][col] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        move = {score, index: [row, col]};
                    }
                }
            }
        }

        return move;
    } else {
        let bestScore = Infinity;
        let move = {score: bestScore};

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    board[row][col] = 'X';
                    let score = minimax(board, depth + 1, true).score;
                    board[row][col] = '';
                    if (score < bestScore) {
                        bestScore = score;
                        move = {score, index: [row, col]};
                    }
                }
            }
        }

        return move;
    }
}

function checkWinner() {
    // Check rows
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === board[row][1] && board[row][1] === board[row][2] && board[row][0] !== '') {
            return `${board[row][0]} wins!`;
        }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
        if (board[0][col] === board[1][col] && board[1][col] === board[2][col] && board[0][col] !== '') {
            return `${board[0][col]} wins!`;
        }
    }

    // Check diagonals
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
        return `${board[0][0]} wins!`;
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
        return `${board[0][2]} wins!`;
    }

    // Check for a tie
    let openSpots = 0;
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
                openSpots++;
            }
        }
    }
    if (openSpots === 0) {
        return 'Tie!';
    }

    return null; // No winner yet
}

function mousePressed() {

    let col = floor(mouseX / (width / 3));
    let row = floor(mouseY / (height / 3));
    if (col >= 0 && row >= 0) {
        if (board[row][col] == '') {
            board[row][col] = currentPlayer;
            currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
            prev_actions.push(get_pos(col, row));

            redraw();
        } else {
            board[row][col] = '';
            currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
            prev_actions = prev_actions.filter(function (item) {
                return item !== get_pos(col, row);
            });

            redraw();
        }

    }
}

function get_pos(col, row) {
    let pos = 3 * (row) + (col + 1);
    return pos;
}

