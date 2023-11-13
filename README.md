# TicTacToeStrategy

The project enable to play Tic-Tac-Toe with some statistics about the possible ends of the game. The information of all the possible ends were computed using python script [extractStats.py](https://github.com/adebiasi/TicTacToeStrategy/blob/main/extractStats.py). The generated [actions.json](https://github.com/adebiasi/TicTacToeStrategy/blob/main/actions.json) file is parsed and used to visualize the statistics during the game in p5js.

It's possible to see statistics of win and tie based on the following assumptions:

- No assumptions about the opponents strategy
- The opponents will choose the best move to WIN
- The opponents will choose the best move not to LOSE (WIN or TIE)

# Try it

You can try the game with statistics here:
https://adebiasi.github.io/TicTacToeStrategy/


# Screenshots
A game situation with the statistics about different assumptions.

![No assumptions](https://github.com/adebiasi/TicTacToeStrategy/blob/main/imgs/stats_no_ass.png)
![Win assumption](https://github.com/adebiasi/TicTacToeStrategy/blob/main/imgs/stats_win_ass.png)
![Win or tie assumption](https://github.com/adebiasi/TicTacToeStrategy/blob/main/imgs/stats_win_tie_ass.png)
