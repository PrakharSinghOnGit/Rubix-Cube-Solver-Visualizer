# Class For Generating NxN Cube Structure and Hashable Conversion

class RubiksCube:
    def __init__(self, n):
        self.n = n;
        self.faces = {
            'U' : [['W'] * n for _ in range(n)],
            'D' : [['Y'] * n for _ in range(n)],
            'L' : [['G'] * n for _ in range(n)],
            'R' : [['B'] * n for _ in range(n)],
            'F' : [['R'] * n for _ in range(n)],
            'B' : [['O'] * n for _ in range(n)]
        }
        
    def is_solved(self):
        # Returns True if all faces of the cube are of same color respective to its face
        return all(all(row.count(row[0]) == len(row) for row in face) for face in self.faces.values())
    
    def get_state(self):
        # Converts cube state to nested tuple format and returns a unique hashable state representation  
        return tuple(tuple(tuple(row) for row in face) for face in self.faces.values())
    
    def __str__(self):
        # Prints Cube State
        return '\n'.join(f"{face}: {self.faces[face]}" for face in self.faces)
    

cube = RubiksCube(3) 
# print(cube)
