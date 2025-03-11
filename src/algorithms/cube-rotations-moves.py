from cubeStructure import cube

def rotate_90_cw(face):
    # rotates 90 deg. Clockwise
    return [list(row) for row in zip(*face[::-1])]

def rotate_90_ccw(face):
    # rotates 90 deg. Counter-Clockwise
    return [list(row) for row in zip(*face)][::-1]

def move_U(cube):
    # Rotate U face clockwise.
    cube.faces['U'] = rotate_90_cw(cube.faces['U'])

    temp = cube.faces['F'][0][:]

    cube.faces['F'][0] = cube.faces['R'][0]
    cube.faces['R'][0] = cube.faces['B'][0]
    cube.faces['B'][0] = cube.faces['L'][0]
    cube.faces['L'][0] = temp

def move_U_prime(cube):
    # For U' (anticlockwise), first copy then swap.
    temp = cube.faces['F'][0][:]

    cube.faces['F'][0] = cube.faces['L'][0]
    cube.faces['L'][0] = cube.faces['B'][0]
    cube.faces['B'][0] = cube.faces['R'][0]
    cube.faces['R'][0] = temp

    cube.faces['U'] = rotate_90_ccw(cube.faces['U'])

def move_D(cube):
    # Rotate D face clockwise.
    cube.faces['D'] = rotate_90_cw(cube.faces['D'])
   
    temp = cube.faces['F'][-1][:]
   
    cube.faces['F'][-1] = cube.faces['L'][-1]
    cube.faces['L'][-1] = cube.faces['B'][-1]
    cube.faces['B'][-1] = cube.faces['R'][-1]
    cube.faces['R'][-1] = temp

def move_D_prime(cube):
    temp = cube.faces['F'][-1][:]
   
    cube.faces['F'][-1] = cube.faces['R'][-1]
    cube.faces['R'][-1] = cube.faces['B'][-1]
    cube.faces['B'][-1] = cube.faces['L'][-1]
    cube.faces['L'][-1] = temp
   
    cube.faces['D'] = rotate_90_ccw(cube.faces['D'])

def move_L(cube):
    n = cube.n
    cube.faces['L'] = rotate_90_cw(cube.faces['L'])
    # Save U left column.
    temp = [cube.faces['U'][i][0] for i in range(n)]
    # U left column <- reversed(B right column.
    col_B = [cube.faces['B'][i][-1] for i in range(n)]
    for i in range(n):
        cube.faces['U'][i][0] = col_B[n - 1 - i]
    # B right column <- reversed(D left column.
    col_D = [cube.faces['D'][i][0] for i in range(n)]
    for i in range(n):
        cube.faces['B'][i][-1] = col_D[n - 1 - i]
    # D left column <- F left column (normal order).
    col_F = [cube.faces['F'][i][0] for i in range(n)]
    for i in range(n):
        cube.faces['D'][i][0] = col_F[i]
    # F left column <- temp (original U left column, normal order).
    for i in range(n):
        cube.faces['F'][i][0] = temp[i]

def move_L_prime(cube):
    n = cube.n
    temp = [cube.faces['U'][i][0] for i in range(n)]
    # U left column <- F left column.
    for i in range(n):
        cube.faces['U'][i][0] = cube.faces['F'][i][0]
    # F left column <- D left column.
    for i in range(n):
        cube.faces['F'][i][0] = cube.faces['D'][i][0]
    # D left column <- reversed(B right column).
    col_B = [cube.faces['B'][i][-1] for i in range(n)]
    for i in range(n):
        cube.faces['D'][i][0] = col_B[n - 1 - i]
    # B right column <- reversed(temp).
    for i in range(n):
        cube.faces['B'][i][-1] = temp[n - 1 - i]
    cube.faces['L'] = rotate_90_ccw(cube.faces['L'])

def move_R(cube):
    n = cube.n
    cube.faces['R'] = rotate_90_cw(cube.faces['R'])
    temp = [cube.faces['U'][i][-1] for i in range(n)]
    # U right column <- reversed(B left column).
    col_B = [cube.faces['B'][i][0] for i in range(n)]
    for i in range(n):
        cube.faces['U'][i][-1] = col_B[n - 1 - i]
    # B left column <- reversed(D right column).
    col_D = [cube.faces['D'][i][-1] for i in range(n)]
    for i in range(n):
        cube.faces['B'][i][0] = col_D[n - 1 - i]
    # D right column <- F right column (normal).
    col_F = [cube.faces['F'][i][-1] for i in range(n)]
    for i in range(n):
        cube.faces['D'][i][-1] = col_F[i]
    # F right column <- temp (original U right column, normal).
    for i in range(n):
        cube.faces['F'][i][-1] = temp[i]

def move_R_prime(cube):
    n = cube.n
    temp = [cube.faces['U'][i][-1] for i in range(n)]
    # U right column <- F right column.
    for i in range(n):
        cube.faces['U'][i][-1] = cube.faces['F'][i][-1]
    # F right column <- D right column.
    for i in range(n):
        cube.faces['F'][i][-1] = cube.faces['D'][i][-1]
    # D right column <- reversed(B left column).
    col_B = [cube.faces['B'][i][0] for i in range(n)]
    for i in range(n):
        cube.faces['D'][i][-1] = col_B[n - 1 - i]
    # B left column <- reversed(temp).
    for i in range(n):
        cube.faces['B'][i][0] = temp[n - 1 - i]
    cube.faces['R'] = rotate_90_ccw(cube.faces['R'])

def move_F(cube):
    n = cube.n
    cube.faces['F'] = rotate_90_cw(cube.faces['F'])
    temp = cube.faces['U'][-1][:]  # Save U bottom row.
    # U bottom row <- reversed(L right column.
    col_L = [cube.faces['L'][i][-1] for i in range(n)]
    cube.faces['U'][-1] = col_L[::-1]
    # L right column <- D top row (normal order).
    temp_D = cube.faces['D'][0][:]
    for i in range(n):
        cube.faces['L'][i][-1] = temp_D[i]
    # D top row <- reversed(R left column.
    col_R = [cube.faces['R'][i][0] for i in range(n)]
    cube.faces['D'][0] = col_R[::-1]
    # R left column <- temp (original U bottom row, normal order).
    for i in range(n):
        cube.faces['R'][i][0] = temp[i]

def move_F_prime(cube):
    n = cube.n
    temp = cube.faces['U'][-1][:]
    # U bottom row <- R left column (normal).
    for i in range(n):
        cube.faces['U'][-1][i] = cube.faces['R'][i][0]
    # R left column <- reversed(D top row).
    temp_D = cube.faces['D'][0][:]
    for i in range(n):
        cube.faces['R'][i][0] = temp_D[::-1][i]
    # D top row <- L right column (normal).
    temp_L = [cube.faces['L'][i][-1] for i in range(n)]
    cube.faces['D'][0] = temp_L
    # L right column <- reversed(temp) (original U bottom row).
    for i in range(n):
        cube.faces['L'][i][-1] = temp[::-1][i]
    cube.faces['F'] = rotate_90_ccw(cube.faces['F'])

def move_B(cube):
    n = cube.n
    cube.faces['B'] = rotate_90_cw(cube.faces['B'])
    temp = cube.faces['U'][0][:]  # Save U top row.
    # U top row <- reversed(R right column).
    col_R = [cube.faces['R'][i][-1] for i in range(n)]
    cube.faces['U'][0] = col_R[::-1]
    # R right column <- D bottom row (normal).
    temp_D = cube.faces['D'][-1][:]
    for i in range(n):
        cube.faces['R'][i][-1] = temp_D[i]
    # D bottom row <- reversed(L left column).
    col_L = [cube.faces['L'][i][0] for i in range(n)]
    cube.faces['D'][-1] = col_L[::-1]
    # L left column <- temp (original U top row, normal).
    for i in range(n):
        cube.faces['L'][i][0] = temp[i]

def move_B_prime(cube):
    n = cube.n
    temp = cube.faces['U'][0][:]
    # U top row <- L left column (normal).
    for i in range(n):
        cube.faces['U'][0][i] = cube.faces['L'][i][0]
    # L left column <- reversed(D bottom row).
    temp_D = cube.faces['D'][-1][:]
    for i in range(n):
        cube.faces['L'][i][0] = temp_D[::-1][i]
    # D bottom row <- R right column (normal).
    temp_R = [cube.faces['R'][i][-1] for i in range(n)]
    cube.faces['D'][-1] = temp_R
    # R right column <- reversed(temp) (original U top row).
    for i in range(n):
        cube.faces['R'][i][-1] = temp[::-1][i]
    cube.faces['B'] = rotate_90_ccw(cube.faces['B'])

print(move_F_prime(cube))
print(cube)
