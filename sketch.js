let actions

let board;
let currentPlayer = 'X';
let prev_actions = []

let assumptionTexts = ["No assumptions about the opponents strategy", "We assume the opponents will choose the best move to WIN", "We assume the opponents will choose the best move to WIN or TIE"];
let currAssumption = 0;
let stats;
let assumptionButton;

function extract_stats(prev_actions) {
    let num_p1_wins = 0;
    let num_p2_wins = 0;
    let num_tie = 0
    if (actions != null) {
        for (let i = 0; i < actions.length; i++) {

            let curr_action = actions[i]

            if (!equalsCheck(curr_action[0].slice(0, prev_actions.length), prev_actions)) {
                continue;
            }
            if (curr_action[1] == 'P1')
                num_p1_wins += 1;
            if (curr_action[1] == 'P2')
                num_p2_wins += 1;
            if (curr_action[1] == 'tie')
                num_tie += 1;
        }
    }
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

    assumptionButton = select('#assumptionButton');
    assumptionButton.mousePressed(changeAssumption);
    // print(actions.length())

}

function changeAssumption() {
    console.log("changeAssumption")

    currAssumption = ((currAssumption + 1) % assumptionTexts.length)
    console.log(currAssumption)
    redraw();
}

function draw() {
    background(0);
    textAlign(LEFT, LEFT);
    stroke(0)
    textSize(25);

    fill(255, 255, 255);
    text(assumptionTexts[currAssumption], 0, 13);

    calculateStats()
    draw_grid(width, height)
}

function calculateStats() {
    stats = [];
    if (currAssumption == 0) {
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 3; i++) {
                let spot = board[j][i];
                if (spot != 'O' && spot != 'X') {
                    stats.push(extract_stats([...prev_actions, get_pos(i, j)]));
                } else {
                    stats.push([]);
                }
            }
        }
        //TODO remove duplicated code for currAssumption == 1 and 2
    } else if (currAssumption == 1) {
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
                    let bestStats = null;
                    let bestTot = null;
                    let best_value = null;
                    let best_perc_win_tie = null;
                    let best_perc_win = null;
                    for (let z = 0; z < availableMoves.length; z++) {
                        let currPos = get_pos(i, j);
                        if (currPos != availableMoves[z]) {
                            let currStats = extract_stats([...prev_actions, currPos, availableMoves[z]])
                            let currTot = currStats[0] + currStats[1] + currStats[2]
                            let curr_value = ((currentPlayer == 'X') ? currStats[1] : currStats[0]);
                            let curr_perc_win_tie = (curr_value + currStats[2]) / currTot;
                            let curr_perc_win = (curr_value) / currTot;
                            if (bestStats == null || curr_perc_win > best_perc_win || (curr_perc_win == best_perc_win && (curr_perc_win_tie > best_perc_win_tie))) {
                                bestStats = currStats;
                                bestTot = bestStats[0] + bestStats[1] + bestStats[2]
                                best_value = ((currentPlayer == 'X') ? bestStats[1] : bestStats[0]);
                                best_perc_win_tie = (best_value + bestStats[2]) / bestTot;
                                best_perc_win = (best_value) / bestTot;
                            }
                        }
                    }
                    if (bestStats != null) {
                        stats.push(bestStats);
                    }else{
                        //last move case
                        stats.push(extract_stats([...prev_actions, get_pos(i, j)]));
                    }
                } else {
                    stats.push([]);
                }
            }
        }

    } else if (currAssumption == 2) {
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
                    let bestStats = null;
                    let bestTot = null;
                    let best_value = null;
                    let best_perc_win_tie = null;
                    let best_perc_win = null;
                    for (let z = 0; z < availableMoves.length; z++) {
                        let currPos = get_pos(i, j);
                        if (currPos != availableMoves[z]) {
                            let currStats = extract_stats([...prev_actions, currPos, availableMoves[z]])
                            let currTot = currStats[0] + currStats[1] + currStats[2]
                            let curr_value = ((currentPlayer == 'X') ? currStats[1] : currStats[0]);
                            let curr_perc_win_tie = (curr_value + currStats[2]) / currTot;
                            let curr_perc_win = (curr_value) / currTot;
                            if (bestStats == null || curr_perc_win_tie > best_perc_win_tie || (curr_perc_win_tie == best_perc_win_tie && curr_perc_win > best_perc_win)) {
                                bestStats = currStats;
                                bestTot = bestStats[0] + bestStats[1] + bestStats[2]
                                best_value = ((currentPlayer == 'X') ? bestStats[1] : bestStats[0]);
                                best_perc_win_tie = (best_value + bestStats[2]) / bestTot;
                                best_perc_win = (best_value) / bestTot;
                            }
                        }
                    }
                    if (bestStats != null) {
                        stats.push(bestStats);
                    }else{
                        //last move case
                        stats.push(extract_stats([...prev_actions, get_pos(i, j)]));
                    }
                } else {
                    stats.push([]);
                }
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

    if (currentPlayer == 'X') {

    } else {
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
                // let stat = extract_stats([...prev_actions, get_pos(i, j)])
                let stat = stats[get_pos(i, j) - 1]
                let tot = stat[0] + stat[1] + stat[2]
                let curr_value = ((currentPlayer == 'X') ? stat[0] : stat[1]);
                const percentageWin = "win: " + (curr_value / tot * 100).toFixed(2) + "%";
                const percentageTie = "win/tie: " + ((curr_value + stat[2]) / tot * 100).toFixed(2) + "%";
                stroke(0)
                if (currentPlayer == 'X') {
                    // stroke(0,255,0)
                    fill(0, 255, 0);
                } else {
                    // stroke(255,0,0)
                    fill(255, 0, 0);
                }
                textSize(35);
                text(percentageWin + "\n" + percentageTie, x, y - h / 4);
                textSize(20);
                text("# possible ends\nX: " + stat[0] + "\nO: " + stat[1] + "\ntie: " + stat[2], x, y + h / 4);
            }
        }
    }
}

function mousePressed() {
    // if (winner == null) {

    let i = floor(mouseX / (width / 3));
    let j = floor(mouseY / (height / 3));
    if (i >= 0 && j >= 0) {
        if (board[j][i] == '') {
            board[j][i] = currentPlayer;
            currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
            prev_actions.push(get_pos(i, j));
            redraw();
        }
    }
    // }
}

function get_pos(i, j) {
    let pos = 3 * (j) + (i + 1);
    return pos;
}

