# TicTacToeStrategy

**TicTacToeStrategy** is an interactive Tic-Tac-Toe game that includes real-time statistical insights into potential game outcomes. These insights are based on precomputed data about all possible endgame scenarios, generated using the Python script [`extractStats.py`](https://github.com/adebiasi/TicTacToeStrategy/blob/main/extractStats.py). The resulting file, [`actions.json`](https://github.com/adebiasi/TicTacToeStrategy/blob/main/actions.json), is parsed in a [p5.js](https://p5js.org/) application to visualize strategic statistics during gameplay.

### Game Assumptions

The game displays outcome probabilities (win/tie) based on different assumptions about your opponent's strategy:

- **No assumptions** – The opponent makes completely random moves.
- **Win-seeking opponent** – The opponent always chooses the move that leads to the highest chance of winning.
- **Win or tie-seeking opponent** – The opponent tries to avoid losing, aiming for a win or at least a tie.

---

## 🎮 Try it out

Play the game with integrated statistics here:  
👉 [**TicTacToeStrategy Web App**](https://adebiasi.github.io/TicTacToeStrategy/)

---

## 📸 Screenshots

Here are some examples of in-game statistical visualizations based on different strategic assumptions:

**No assumptions**  
![No assumptions](https://github.com/adebiasi/TicTacToeStrategy/blob/main/imgs/stats_no_ass.png)

**Win-seeking assumption**  
![Win assumption](https://github.com/adebiasi/TicTacToeStrategy/blob/main/imgs/stats_win_ass.png)

**Win or tie-seeking assumption**  
![Win or tie assumption](https://github.com/adebiasi/TicTacToeStrategy/blob/main/imgs/stats_win_tie_ass.png)

---

## ✅ To-Do

- [x] Implement [Minimax algorithm](https://www.geeksforgeeks.org/finding-optimal-move-in-tic-tac-toe-using-minimax-algorithm-in-game-theory/)
