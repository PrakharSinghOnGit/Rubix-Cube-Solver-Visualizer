import {Cube} from './cube.ts';

const cube = new Cube(3);
cube.printCube();
cube.rotate([1,2],'X', true);
cube.printCube();

