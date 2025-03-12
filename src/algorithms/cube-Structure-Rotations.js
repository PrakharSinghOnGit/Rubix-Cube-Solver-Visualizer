class RubiksCube {
    constructor(n) {
      this.n = n;
      this.faces = {
        U: Array.from({ length: n }, () => Array(n).fill('W')),
        D: Array.from({ length: n }, () => Array(n).fill('Y')),
        L: Array.from({ length: n }, () => Array(n).fill('G')),
        R: Array.from({ length: n }, () => Array(n).fill('B')),
        F: Array.from({ length: n }, () => Array(n).fill('R')),
        B: Array.from({ length: n }, () => Array(n).fill('O'))
      };
    }
  
    // Checks if all faces are solved:
    isSolved() {
      return Object.values(this.faces).every(face =>
        face.every(row => row.every(cell => cell === row[0]))
      );
    }
  
    // Returns a deep copy of the cube state as a nested array structure.
    getState() {
      return {
        U: this.faces.U.map(row => row.slice()),
        D: this.faces.D.map(row => row.slice()),
        L: this.faces.L.map(row => row.slice()),
        R: this.faces.R.map(row => row.slice()),
        F: this.faces.F.map(row => row.slice()),
        B: this.faces.B.map(row => row.slice())
      };
    }
  
    toString() {
      return Object.entries(this.faces)
        .map(([face, grid]) => 
          `${face}: ${JSON.stringify(grid).replace(/,/g, ', ')}`
        )
        .join('\n');
    }
    
  }
  
  // ----- Cube rotation functions -----

  function rotate90cw(face) {
    // Rotate 90° clockwise:
    // For each column i in the original face, take the column values and reverse them.
    return face[0].map((_, i) => face.map(row => row[i]).reverse());
  }
  
  function rotate90ccw(face) {
    // Rotate 90° counterclockwise:
    // Map over each column (in order) and then reverse the order of rows.
    return face[0].map((_, i) => face.map(row => row[i])).reverse();
  }
  
  // ----- Cube move functions -----
  
  function move_U(cube) {
    // Rotate U face clockwise.
    cube.faces['U'] = rotate90cw(cube.faces['U']);
  
    // Save F top row.
    let temp = cube.faces['F'][0].slice();
  
    cube.faces['F'][0] = cube.faces['R'][0];
    cube.faces['R'][0] = cube.faces['B'][0];
    cube.faces['B'][0] = cube.faces['L'][0];
    cube.faces['L'][0] = temp;
  }
  
  function move_U_prime(cube) {
    // Save F top row.
    let temp = cube.faces['F'][0].slice();
  
    cube.faces['F'][0] = cube.faces['L'][0];
    cube.faces['L'][0] = cube.faces['B'][0];
    cube.faces['B'][0] = cube.faces['R'][0];
    cube.faces['R'][0] = temp;
  
    cube.faces['U'] = rotate90ccw(cube.faces['U']);
  }
  
  function move_D(cube) {
    cube.faces['D'] = rotate90cw(cube.faces['D']);
    let lastIndex = cube.faces['F'].length - 1;
    let temp = cube.faces['F'][lastIndex].slice();
  
    cube.faces['F'][lastIndex] = cube.faces['L'][lastIndex];
    cube.faces['L'][lastIndex] = cube.faces['B'][lastIndex];
    cube.faces['B'][lastIndex] = cube.faces['R'][lastIndex];
    cube.faces['R'][lastIndex] = temp;
  }
  
  function move_D_prime(cube) {
    let lastIndex = cube.faces['F'].length - 1;
    let temp = cube.faces['F'][lastIndex].slice();
  
    cube.faces['F'][lastIndex] = cube.faces['R'][lastIndex];
    cube.faces['R'][lastIndex] = cube.faces['B'][lastIndex];
    cube.faces['B'][lastIndex] = cube.faces['L'][lastIndex];
    cube.faces['L'][lastIndex] = temp;
  
    cube.faces['D'] = rotate90ccw(cube.faces['D']);
  }
  
  function move_L(cube) {
    let n = cube.n;
    cube.faces['L'] = rotate90cw(cube.faces['L']);
  
    // Save U left column.
    let temp = [];
    for (let i = 0; i < n; i++) {
      temp.push(cube.faces['U'][i][0]);
    }
  
    // U left column <- reversed(B right column).
    let colB = [];
    for (let i = 0; i < n; i++) {
      let rowB = cube.faces['B'][i];
      colB.push(rowB[rowB.length - 1]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['U'][i][0] = colB[n - 1 - i];
    }
  
    // B right column <- reversed(D left column).
    let colD = [];
    for (let i = 0; i < n; i++) {
      colD.push(cube.faces['D'][i][0]);
    }
    for (let i = 0; i < n; i++) {
      let rowB = cube.faces['B'][i];
      rowB[rowB.length - 1] = colD[n - 1 - i];
    }
  
    // D left column <- F left column (normal order).
    let colF = [];
    for (let i = 0; i < n; i++) {
      colF.push(cube.faces['F'][i][0]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['D'][i][0] = colF[i];
    }
  
    // F left column <- temp (original U left column).
    for (let i = 0; i < n; i++) {
      cube.faces['F'][i][0] = temp[i];
    }
  }
  
  function move_L_prime(cube) {
    let n = cube.n;
    let temp = [];
    for (let i = 0; i < n; i++) {
      temp.push(cube.faces['U'][i][0]);
    }
  
    // U left column <- F left column.
    for (let i = 0; i < n; i++) {
      cube.faces['U'][i][0] = cube.faces['F'][i][0];
    }
  
    // F left column <- D left column.
    for (let i = 0; i < n; i++) {
      cube.faces['F'][i][0] = cube.faces['D'][i][0];
    }
  
    // D left column <- reversed(B right column).
    let colB = [];
    for (let i = 0; i < n; i++) {
      let rowB = cube.faces['B'][i];
      colB.push(rowB[rowB.length - 1]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['D'][i][0] = colB[n - 1 - i];
    }
  
    // B right column <- reversed(temp).
    for (let i = 0; i < n; i++) {
      let rowB = cube.faces['B'][i];
      rowB[rowB.length - 1] = temp[n - 1 - i];
    }
  
    cube.faces['L'] = rotate90ccw(cube.faces['L']);
  }
  
  function move_R(cube) {
    let n = cube.n;
    cube.faces['R'] = rotate90cw(cube.faces['R']);
  
    let temp = [];
    for (let i = 0; i < n; i++) {
      let rowU = cube.faces['U'][i];
      temp.push(rowU[rowU.length - 1]);
    }
  
    // U right column <- reversed(B left column).
    let colB = [];
    for (let i = 0; i < n; i++) {
      let rowB = cube.faces['B'][i];
      colB.push(rowB[0]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['U'][i][cube.faces['U'][i].length - 1] = colB[n - 1 - i];
    }
  
    // B left column <- reversed(D right column).
    let colD = [];
    for (let i = 0; i < n; i++) {
      let rowD = cube.faces['D'][i];
      colD.push(rowD[rowD.length - 1]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['B'][i][0] = colD[n - 1 - i];
    }
  
    // D right column <- F right column (normal order).
    let colF = [];
    for (let i = 0; i < n; i++) {
      let rowF = cube.faces['F'][i];
      colF.push(rowF[rowF.length - 1]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['D'][i][cube.faces['D'][i].length - 1] = colF[i];
    }
  
    // F right column <- temp (original U right column).
    for (let i = 0; i < n; i++) {
      cube.faces['F'][i][cube.faces['F'][i].length - 1] = temp[i];
    }
  }
  
  function move_R_prime(cube) {
    let n = cube.n;
    let temp = [];
    for (let i = 0; i < n; i++) {
      let rowU = cube.faces['U'][i];
      temp.push(rowU[rowU.length - 1]);
    }
  
    // U right column <- F right column.
    for (let i = 0; i < n; i++) {
      cube.faces['U'][i][cube.faces['U'][i].length - 1] = cube.faces['F'][i][cube.faces['F'][i].length - 1];
    }
  
    // F right column <- D right column.
    for (let i = 0; i < n; i++) {
      cube.faces['F'][i][cube.faces['F'][i].length - 1] = cube.faces['D'][i][cube.faces['D'][i].length - 1];
    }
  
    // D right column <- reversed(B left column).
    let colB = [];
    for (let i = 0; i < n; i++) {
      let rowB = cube.faces['B'][i];
      colB.push(rowB[0]);
    }
    for (let i = 0; i < n; i++) {
      cube.faces['D'][i][cube.faces['D'][i].length - 1] = colB[n - 1 - i];
    }
  
    // B left column <- reversed(temp).
    for (let i = 0; i < n; i++) {
      cube.faces['B'][i][0] = temp[n - 1 - i];
    }
  
    cube.faces['R'] = rotate90ccw(cube.faces['R']);
  }
  
  function move_F(cube) {
    let n = cube.n;
    cube.faces['F'] = rotate90cw(cube.faces['F']);
  
    let lastRowIndex = cube.faces['U'].length - 1;
    let temp = cube.faces['U'][lastRowIndex].slice(); // Save U bottom row.
  
    // U bottom row <- reversed(L right column).
    let colL = [];
    for (let i = 0; i < n; i++) {
      let rowL = cube.faces['L'][i];
      colL.push(rowL[rowL.length - 1]);
    }
    cube.faces['U'][lastRowIndex] = colL.slice().reverse();
  
    // L right column <- D top row (normal order).
    let tempD = cube.faces['D'][0].slice();
    for (let i = 0; i < n; i++) {
      cube.faces['L'][i][cube.faces['L'][i].length - 1] = tempD[i];
    }
  
    // D top row <- reversed(R left column).
    let colR = [];
    for (let i = 0; i < n; i++) {
      let rowR = cube.faces['R'][i];
      colR.push(rowR[0]);
    }
    cube.faces['D'][0] = colR.slice().reverse();
  
    // R left column <- temp (original U bottom row).
    for (let i = 0; i < n; i++) {
      cube.faces['R'][i][0] = temp[i];
    }
  }
  
  function move_F_prime(cube) {
    let n = cube.n;
    let lastRowIndex = cube.faces['U'].length - 1;
    let temp = cube.faces['U'][lastRowIndex].slice();
  
    // U bottom row <- R left column (normal order).
    for (let i = 0; i < n; i++) {
      cube.faces['U'][lastRowIndex][i] = cube.faces['R'][i][0];
    }
  
    // R left column <- reversed(D top row).
    let tempD = cube.faces['D'][0].slice();
    let reversedTempD = tempD.slice().reverse();
    for (let i = 0; i < n; i++) {
      cube.faces['R'][i][0] = reversedTempD[i];
    }
  
    // D top row <- L right column (normal order).
    let tempL = [];
    for (let i = 0; i < n; i++) {
      let rowL = cube.faces['L'][i];
      tempL.push(rowL[rowL.length - 1]);
    }
    cube.faces['D'][0] = tempL;
  
    // L right column <- reversed(temp) (original U bottom row).
    let reversedTemp = temp.slice().reverse();
    for (let i = 0; i < n; i++) {
      cube.faces['L'][i][cube.faces['L'][i].length - 1] = reversedTemp[i];
    }
  
    cube.faces['F'] = rotate90ccw(cube.faces['F']);
  }
  
  function move_B(cube) {
    let n = cube.n;
    cube.faces['B'] = rotate90cw(cube.faces['B']);
  
    let temp = cube.faces['U'][0].slice(); // Save U top row.
  
    // U top row <- reversed(R right column).
    let colR = [];
    for (let i = 0; i < n; i++) {
      let rowR = cube.faces['R'][i];
      colR.push(rowR[rowR.length - 1]);
    }
    cube.faces['U'][0] = colR.slice().reverse();
  
    // R right column <- D bottom row (normal order).
    let lastRowIndex = cube.faces['D'].length - 1;
    let tempD = cube.faces['D'][lastRowIndex].slice();
    for (let i = 0; i < n; i++) {
      cube.faces['R'][i][cube.faces['R'][i].length - 1] = tempD[i];
    }
  
    // D bottom row <- reversed(L left column).
    let colL = [];
    for (let i = 0; i < n; i++) {
      let rowL = cube.faces['L'][i];
      colL.push(rowL[0]);
    }
    cube.faces['D'][lastRowIndex] = colL.slice().reverse();
  
    // L left column <- temp (original U top row).
    for (let i = 0; i < n; i++) {
      cube.faces['L'][i][0] = temp[i];
    }
  }
  
  function move_B_prime(cube) {
    let n = cube.n;
    let temp = cube.faces['U'][0].slice();
  
    // U top row <- L left column (normal order).
    for (let i = 0; i < n; i++) {
      cube.faces['U'][0][i] = cube.faces['L'][i][0];
    }
  
    // L left column <- reversed(D bottom row).
    let lastRowIndex = cube.faces['D'].length - 1;
    let tempD = cube.faces['D'][lastRowIndex].slice();
    let reversedTempD = tempD.slice().reverse();
    for (let i = 0; i < n; i++) {
      cube.faces['L'][i][0] = reversedTempD[i];
    }
  
    // D bottom row <- R right column (normal order).
    let tempR = [];
    for (let i = 0; i < n; i++) {
      let rowR = cube.faces['R'][i];
      tempR.push(rowR[rowR.length - 1]);
    }
    cube.faces['D'][lastRowIndex] = tempR;
  
    // R right column <- reversed(temp) (original U top row).
    let reversedTemp = temp.slice().reverse();
    for (let i = 0; i < n; i++) {
      cube.faces['R'][i][cube.faces['R'][i].length - 1] = reversedTemp[i];
    }
  
    cube.faces['B'] = rotate90ccw(cube.faces['B']);
  }
  
  // Driver Code
  const cube = new RubiksCube(3);
  console.log(cube.toString());
  // console.log("Is solved?", cube.isSolved());

  move_B(cube);  
  console.log(cube.toString());
  