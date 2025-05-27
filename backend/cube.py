from pickle import TRUE
from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from typing import Dict, Any, Optional
import logging
import sys
from math import sqrt

# Import the real rubiks cube libraries
from rubikscubennnsolver import SolveError, configure_logging, reverse_steps
from rubikscubennnsolver.RubiksCube222 import RubiksCube222
from rubikscubennnsolver.RubiksCube333 import RubiksCube333
from rubikscubennnsolver.RubiksCube444 import RubiksCube444
from rubikscubennnsolver.RubiksCube555 import RubiksCube555
from rubikscubennnsolver.RubiksCube666 import RubiksCube666
from rubikscubennnsolver.RubiksCube777 import RubiksCube777
from rubikscubennnsolver.RubiksCubeNNNEven import RubiksCubeNNNEven
from rubikscubennnsolver.RubiksCubeNNNOdd import RubiksCubeNNNOdd

if sys.version_info < (3, 6):
    raise SystemError("Must be using Python 3.6 or higher")

# Configure logging
configure_logging()
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for React app

class CubeAPIWrapper:
    """Wrapper class to manage cube instances with real cube solver"""
    
    def __init__(self):
        self.cubes = {}
    
    def create_cube(self, size: int, state: Optional[str] = None, order: str = "URFDLB", colormap: Optional[str] = None) -> str:
        """Create a new cube instance and return its ID"""
        cube_id = str(uuid.uuid4())
        
        # Use default solved state if none provided
        if state is None:
            state = self._get_solved_state(size)
        
        # Handle color replacements like in the original script
        if "G" in state:
            state = state.replace("G", "F")
            state = state.replace("Y", "D")
            state = state.replace("O", "L")
            state = state.replace("W", "U")
        
        # Create appropriate cube based on size
        try:
            if size == 2:
                cube = RubiksCube222(state, order, colormap)
            elif size == 3:
                cube = RubiksCube333(state, order, colormap)
            elif size == 4:
                cube = RubiksCube444(state, order, colormap)
            elif size == 5:
                cube = RubiksCube555(state, order, colormap)
            elif size == 6:
                cube = RubiksCube666(state, order, colormap)
            elif size == 7:
                cube = RubiksCube777(state, order, colormap)
            elif size % 2 == 0:
                cube = RubiksCubeNNNEven(state, order, colormap)
            else:
                cube = RubiksCubeNNNOdd(state, order, colormap)
            
            # Perform sanity check
            cube.sanity_check()
            
            self.cubes[cube_id] = {
                'instance': cube,
                'size': size,
                'original_state': state
            }
            
            logger.info(f"Created {size}x{size}x{size} cube with ID {cube_id}")
            return cube_id
            
        except Exception as e:
            logger.error(f"Failed to create cube: {str(e)}")
            raise ValueError(f"Failed to create cube: {str(e)}")
    
    def get_cube(self, cube_id: str):
        """Get cube instance by ID"""
        if cube_id not in self.cubes:
            raise ValueError(f"Cube {cube_id} not found")
        return self.cubes[cube_id]['instance']
    
    def get_cube_info(self, cube_id: str):
        """Get cube info by ID"""
        if cube_id not in self.cubes:
            raise ValueError(f"Cube {cube_id} not found")
        return self.cubes[cube_id]
    
    def delete_cube(self, cube_id: str):
        """Delete cube instance"""
        if cube_id in self.cubes:
            del self.cubes[cube_id]
            logger.info(f"Deleted cube {cube_id}")
            return True
        return False
    
    def _get_solved_state(self, size: int) -> str:
        """Return solved state string for given size"""
        squares_per_face = size * size
        return ("U" * squares_per_face + 
                "R" * squares_per_face + 
                "F" * squares_per_face + 
                "D" * squares_per_face + 
                "L" * squares_per_face + 
                "B" * squares_per_face)

# Initialize the wrapper
cube_manager = CubeAPIWrapper()

@app.route('/cube', methods=['POST'])
def create_cube():
    """Create a new cube instance"""
    try:
        data = request.get_json() or {}
        size = data.get('size', 3)
        state = data.get('state', None)
        order = data.get('order', 'URFDLB')
        colormap = data.get('colormap', None)
        
        if size < 2:
            return jsonify({'error': 'Invalid cube size. Minimum size is 2'}), 400
        
        cube_id = cube_manager.create_cube(size, state, order, colormap)
        cube = cube_manager.get_cube(cube_id)
        
        return jsonify({
            'success': True,
            'cube_id': cube_id,
            'size': size,
            'state': cube.get_kociemba_string(True),
            'solved': cube.solved()
        })
    
    except Exception as e:
        logger.error(f"Error creating cube: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/cube/<cube_id>', methods=['GET'])
def get_cube_state(cube_id):
    """Get current cube state"""
    try:
        cube = cube_manager.get_cube(cube_id)
        cube_info = cube_manager.get_cube_info(cube_id)
        
        return jsonify({
            'success': True,
            'cube_id': cube_id,
            'state': cube.get_kociemba_string(True),
            'solved': cube.solved(),
            'size': cube_info['size']
        })
    
    except Exception as e:
        logger.error(f"Error getting cube state: {str(e)}")
        return jsonify({'error': str(e)}), 404

@app.route('/cube/<cube_id>/rotate', methods=['POST'])
def rotate_cube(cube_id):
    """Apply moves to the cube"""
    try:
        data = request.get_json()
        moves = data.get('moves', [])
        
        if isinstance(moves, str):
            moves = moves.split()
        
        cube = cube_manager.get_cube(cube_id)
        
        applied_moves = []
        for move in moves:
            try:
                cube.rotate(move)
                applied_moves.append(move)
            except Exception as move_error:
                logger.error(f"Error applying move {move}: {str(move_error)}")
                return jsonify({
                    'error': f'Invalid move: {move}',
                    'moves_applied': applied_moves
                }), 400
        
        return jsonify({
            'success': True,
            'cube_id': cube_id,
            'moves_applied': applied_moves,
            'state': cube.get_kociemba_string(True),
            'solved': cube.solved()
        })
    
    except Exception as e:
        logger.error(f"Error rotating cube: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/cube/<cube_id>/solve', methods=['POST'])
def solve_cube(cube_id):
    """Solve the cube and return solution"""
    try:
        data = request.get_json() or {}
        solution333 = data.get('solution333', [])
        
        if isinstance(solution333, str):
            solution333 = reverse_steps(solution333.split())
        elif solution333:
            solution333 = reverse_steps(solution333)
        
        cube = cube_manager.get_cube(cube_id)
        
        # Store original state for verification
        original_state = cube.get_kociemba_string(True)
        
        # Solve the cube
        cube.solve()
        solution = cube.get_solution()
        return jsonify({
            'success': True,
            'cube_id': cube_id,
            'solution': solution,
            'solution_length': len(solution),
            'original_state': original_state,
            'solved_state': cube.get_kociemba_string(True),
            'solved': cube.solved()
        })
    
    except SolveError as e:
        logger.error(f"Solve error: {str(e)}")
        return jsonify({'error': f'Solve error: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Error solving cube: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/cube/<cube_id>/reset', methods=['POST'])
def reset_cube(cube_id):
    """Reset cube to its original state"""
    try:
        cube = cube_manager.get_cube(cube_id)
        cube.re_init()
        
        return jsonify({
            'success': True,
            'cube_id': cube_id,
            'state': cube.get_kociemba_string(True),
            'solved': cube.solved()
        })
    
    except Exception as e:
        logger.error(f"Error resetting cube: {str(e)}")
        return jsonify({'error': str(e)}), 400
    """Apply random moves to scramble the cube"""
    try:
        data = request.get_json() or {}
        num_moves = data.get('moves', 20)
        
        cube = cube_manager.get_cube(cube_id)
        cube_info = cube_manager.get_cube_info(cube_id)
        size = cube_info['size']
        
        # Generate appropriate moves for the cube size
        if size == 2:
            move_list = ["U", "R", "F", "U'", "R'", "F'", "U2", "R2", "F2"]
        elif size == 3:
            move_list = ["U", "D", "R", "L", "F", "B", "U'", "D'", "R'", "L'", "F'", "B'", 
                        "U2", "D2", "R2", "L2", "F2", "B2"]
        else:
            move_list = ["U", "D", "R", "L", "F", "B", "U'", "D'", "R'", "L'", "F'", "B'",
                        "U2", "D2", "R2", "L2", "F2", "B2", "Uw", "Dw", "Rw", "Lw", "Fw", "Bw",
                        "Uw'", "Dw'", "Rw'", "Lw'", "Fw'", "Bw'"]
        
        import random
        applied_moves = []
        
        for _ in range(num_moves):
            move = random.choice(move_list)
            try:
                cube.rotate(move)
                applied_moves.append(move)
            except:
                # If move fails, try a basic move
                basic_moves = ["U", "D", "R", "L", "F", "B"]
                move = random.choice(basic_moves)
                cube.rotate(move)
                applied_moves.append(move)
        
        return jsonify({
            'success': True,
            'cube_id': cube_id,
            'moves_applied': applied_moves,
            'state': cube.get_kociemba_string(True),
            'solved': cube.solved()
        })
    
    except Exception as e:
        logger.error(f"Error scrambling cube: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/cube/<cube_id>/kociemba', methods=['GET'])
def get_kociemba_string(cube_id):
    """Get kociemba format string"""
    try:
        cube = cube_manager.get_cube(cube_id)
        
        return jsonify({
            'success': True,
            'cube_id': cube_id,
            'kociemba_string': cube.get_kociemba_string(True)
        })
    
    except Exception as e:
        logger.error(f"Error getting kociemba string: {str(e)}")
        return jsonify({'error': str(e)}), 404

@app.route('/cube/<cube_id>', methods=['DELETE'])
def delete_cube(cube_id):
    """Delete cube instance"""
    try:
        success = cube_manager.delete_cube(cube_id)
        
        if success:
            return jsonify({
                'success': True,
                'message': f'Cube {cube_id} deleted'
            })
        else:
            return jsonify({'error': 'Cube not found'}), 404
    
    except Exception as e:
        logger.error(f"Error deleting cube: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/cubes', methods=['GET'])
def list_cubes():
    """List all active cube instances"""
    try:
        cubes_info = []
        for cube_id, info in cube_manager.cubes.items():
            cube = info['instance']
            cubes_info.append({
                'cube_id': cube_id,
                'size': info['size'],
                'solved': cube.solved(),
                'state': cube.get_kociemba_string(True)[:20] + "..."  # Truncated for list view
            })
        
        return jsonify({
            'success': True,
            'cubes': cubes_info,
            'total_cubes': len(cubes_info)
        })
    
    except Exception as e:
        logger.error(f"Error listing cubes: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'active_cubes': len(cube_manager.cubes),
        'supported_sizes': '2x2x2 to NxNxN'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    logger.info("Starting Rubik's Cube API Server")
    app.run(host='0.0.0.0', port=5175, debug=True)