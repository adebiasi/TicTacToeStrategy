import json

# Leggi i dati JSON dal file
with open("actions.json", "r") as file:
    json_data = json.load(file)

actions = list(json_data)

num_p1_wins = 0;
num_p2_wins = 0;
num_tie = 0

prev_actions = [1, 3 , 2, 6]

# Stampa tutti gli elementi del set
for action in actions:
    #print(action[0]);
    if action[0][:len(prev_actions)] != prev_actions:
        continue;
    if action[1] == 'P1':
        num_p1_wins+=1;
    if action[1] == 'P2':
        num_p2_wins+=1;
    if action[1] == 'tie':
        num_tie+=1;

print(num_p1_wins)
print(num_p2_wins)
print(num_tie)
print(num_p1_wins+num_p2_wins+num_tie)
print(len(actions))