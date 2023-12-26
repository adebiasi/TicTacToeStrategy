let actions

let board;
let currentPlayer = 'X';
let prev_actions = []

let currAssumption = 0;
let assumption_stats_0;
let assumption_stats_1;
let assumption_stats_2;

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

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let spot = board[j][i];
            if (spot != 'O' && spot != 'X') {
                no_assumption_stats.push(extract_stats([...prev_actions, get_pos(i, j)]));
            } else {
                no_assumption_stats.push([]);
            }
        }
    }


    assumption_stats_0 = [];
    assumption_stats_1 = [];
    assumption_stats_2 = [];

    let availableMoves = []
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let spot = board[j][i];
            if (spot != 'O' && spot != 'X') {
                availableMoves.push(get_pos(i, j))
            }
        }
    }


    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let spot = board[j][i];
            if (spot != 'O' && spot != 'X') {
                let bestStats0 = null;
                let bestStats1 = null;
                let bestStats2 = null;
                let best_value_0 = null;
                let best_value_1 = null;
                let best_value_2 = null;
                let currPos = get_pos(i, j);
                for (let z = 0; z < availableMoves.length; z++) {
                    if (currPos != availableMoves[z]) {
                        let currStats = extract_stats([...prev_actions, currPos, availableMoves[z]]);
                        let curr_win = ((currentPlayer == 'X') ? currStats[1] : currStats[0]);
                        let curr_lose = ((currentPlayer == 'X') ? currStats[0] : currStats[1]);
                        let curr_tot = currStats[0] + currStats[1] + currStats[2];
                        let curr_value_0 = (curr_win) / curr_tot;
                        let curr_value_1 = (curr_win + currStats[2]) / curr_tot;
                        let curr_value_2 = 10 * curr_win - 10 * curr_lose;

                        if (curr_tot != 0) {

                            if (bestStats0 == null || curr_value_0 > best_value_0) {
                                bestStats0 = currStats;
                                best_value_0 = curr_value_0;
                            }
                            if (bestStats1 == null || curr_value_1 > best_value_1) {
                                bestStats1 = currStats;
                                best_value_1 = curr_value_1;
                            }
                            if (bestStats2 == null || curr_value_2 > best_value_2) {
                                bestStats2 = currStats;
                                best_value_2 = curr_value_2;
                            }
                        }
                    }
                }
                if (bestStats0 != null) {
                    assumption_stats_0.push(bestStats0);
                } else {
                    //last move case
                    assumption_stats_0.push(extract_stats([...prev_actions, get_pos(i, j)]));
                }
                if (bestStats1 != null) {
                    assumption_stats_1.push(bestStats1);
                } else {
                    //last move case
                    assumption_stats_1.push(extract_stats([...prev_actions, get_pos(i, j)]));
                }
                if (bestStats2 != null) {
                    assumption_stats_2.push(bestStats2);
                } else {
                    //last move case
                    assumption_stats_2.push(extract_stats([...prev_actions, get_pos(i, j)]));
                }
            } else {
                assumption_stats_0.push([]);
                assumption_stats_1.push([]);
                assumption_stats_2.push([]);
            }
        }
    }

    // console.log("calculate assumption_stats: " + assumption_stats)
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
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = i * w + w / 2;
            let y = j * h + h / 2;
            let spot = board[j][i];

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
                let assumption_stat_0 = assumption_stats_0[get_pos(i, j) - 1]
                let assumption_stat_1 = assumption_stats_1[get_pos(i, j) - 1]
                let assumption_stat_2 = assumption_stats_2[get_pos(i, j) - 1]
                let no_assumption_stat = no_assumption_stats[get_pos(i, j) - 1]

                let curr_value_0 = ((currentPlayer == 'X') ? assumption_stat_0[0] : assumption_stat_0[1]) / (assumption_stat_0[0] + assumption_stat_0[1] + assumption_stat_0[2]);
                let curr_value_1 = (((currentPlayer == 'X') ? assumption_stat_1[0] : assumption_stat_1[1]) + assumption_stat_1[2]) / (assumption_stat_1[0] + assumption_stat_1[1] + assumption_stat_1[2]);
                let curr_value_2 = 10 * ((currentPlayer == 'X') ? assumption_stat_2[0] : assumption_stat_2[1]) - 10 * ((currentPlayer == 'X') ? assumption_stat_2[1] : assumption_stat_2[0]);

                textSize(16);
                text(
                    "# possible ends\nX: " + no_assumption_stat[0] + " - O: " + no_assumption_stat[1] + " - tie: " + no_assumption_stat[2] +
                    "\n\nwith assumption 0\nX: " + assumption_stat_0[0] + " - O: " + assumption_stat_0[1] + " - tie: " + assumption_stat_0[2] + "(" + (curr_value_0 * 100).toFixed(2) + "%)" +
                    "\nwith assumption 1\nX: " + assumption_stat_1[0] + " - O: " + assumption_stat_1[1] + " - tie: " + assumption_stat_1[2] + "(" + (curr_value_1 * 100).toFixed(2) + "%)"
                    // "\nwith assumption 2\nX: " + assumption_stat_2[0] + " - O: " + assumption_stat_2[1] + " - tie: " + assumption_stat_2[2] + "(" + (curr_value_2) + ")"
                    , x, y + h / 12);
            }
        }
    }
}

function mousePressed() {

    let i = floor(mouseX / (width / 3));
    let j = floor(mouseY / (height / 3));
    if (i >= 0 && j >= 0) {
        if (board[j][i] == '') {
            board[j][i] = currentPlayer;
            currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
            prev_actions.push(get_pos(i, j));
            redraw();
        } else {
            board[j][i] = '';
            currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
            prev_actions = prev_actions.filter(function (item) {
                return item !== get_pos(i, j);
            });
            redraw();
        }

    }
}

function get_pos(i, j) {
    let pos = 3 * (j) + (i + 1);
    return pos;
}

