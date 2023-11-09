import json


def get_permutations(arr):
    if len(arr) == 0:
        return [[]]  # Permutazione di una lista vuota è una lista vuota

    if len(arr) == 1:
        return [arr]  # Permutazione di una lista con un elemento è la stessa lista

    permutations = []

    for i in range(len(arr)):
        rest = arr[:i] + arr[i+1:]  # Rimuovi l'elemento corrente
        for p in get_permutations(rest):
            permutations.append([arr[i]] + p)

    return permutations

def check_winners(p1_moves,p2_moves):
    if check_winner(p1_moves):
        return 'P1';
    if check_winner(p2_moves):
        return 'P2';
    if len(p1_moves) + len(p2_moves) == 9:
        return 'tie';
    return 'none';    

def check_winner(moves):
    if set([1, 2, 3]).issubset(moves) or set([4, 5, 6]).issubset(moves) or set([7, 8, 9]).issubset(moves) or set([1, 4, 7]).issubset(moves) or set([2, 5, 8]).issubset(moves) or set([3, 6, 9]).issubset(moves) or set([1, 5, 9]).issubset(moves) or set([3, 5, 7]).issubset(moves):
        return True;
    return False;
    
# Esempio di utilizzo
numeri = [1, 2, 3, 4, 5,6,7,8,9]
permutations = get_permutations(numeri)

all_choices = set()
for permutazion in permutations:
    p1_moves = [];
    p2_moves = [];
    curr_moves = [];
    
    
    for index, move in enumerate(permutazion):
        curr_moves.append(move)
        if index % 2 == 0:
            p1_moves.append(move);            
        else:
            p2_moves.append(move);
        status = check_winners(p1_moves,p2_moves)
        if status == 'P1' or status == 'P2' or status == 'tie': 
            break;
    
    all_choices.add((tuple(curr_moves),status));
    
print(len(all_choices))

#all_choices_not_duplicates = []

#for element in all_choices:
#    if element not in all_choices_not_duplicates:    
#        all_choices_not_duplicates.append(element)
#    else:
#        print('duplicated element: '+str(element))
   

#print(len(all_choices_not_duplicates))
 

# Specify the file path where you want to save the JSON object
json_file_path = "actions.json"

# Open the file in write mode and write the JSON object
with open(json_file_path, "w") as file:
    json.dump(list(all_choices), file)

print(f"The object has been saved to '{json_file_path}'.")