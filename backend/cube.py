from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import uuid
from typing import Dict, Any, Optional, List
import logging
import sys
from math import sqrt
import threading
import queue
from datetime import datetime

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

# Filter out WebSocket polling logs
class WebSocketFilter(logging.Filter):
    def filter(self, record):
        # Filter out network/connection related logs
        if record.name in ['werkzeug', 'engineio', 'socketio']:
            return False
            
        # Filter out logs that don't contain useful cube solving information
        message = record.getMessage().lower()
        
        # Filter out technical solver logs
        if any(x in message for x in [
            'connected', 'disconnected', 'socket', 'transport', 
            'polling', 'websocket', 'http', 'request', 'response',
            'client', 'server', 'port', 'host', 'address',
            'lookuptable', 'ida_search', 'cost_to_goal', 'pt_state',
            'threshold', 'explored', 'nodes', 'took', 'nodes-per-sec',
            'solution', 'steps', 'main()', 'fread', 'binary searching',
            'solving via', 'ida_search_via_graph', 'prune-table',
            'legal-moves', 'perfect-hash', 'pt-states'
        ]):
            return False
            
        # Only allow specific solver progress messages
        if record.name.startswith('rubikscubennnsolver'):
            # Only allow messages that indicate major solving phases
            if not any(x in message for x in [
                'centers staged', 'edges eoed', 'edges paired',
                'centers solved', 'solve 3x3x3', 'solve completed'
            ]):
                return False
            
        return True

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading', allow_unsafe_werkzeug=True)

# Custom logging handler to capture logs and send via WebSocket
class WebSocketLogHandler(logging.Handler):
    def __init__(self, socketio_instance):
        super().__init__()
        self.socketio = socketio_instance
        self.log_queue = queue.Queue()
        self.last_message = None
        self.last_timestamp = None
        
    def emit(self, record):
        try:
            # Apply the same filtering as WebSocketFilter
            if not WebSocketFilter().filter(record):
                return
                
            # Create message content for deduplication
            message_content = f"{record.name}:{record.getMessage()}"
            current_time = datetime.now()
            
            # Skip if this is the same message within 1 second
            if (self.last_message == message_content and 
                self.last_timestamp and 
                (current_time - self.last_timestamp).total_seconds() < 1):
                return
                
            # Update last message and timestamp
            self.last_message = message_content
            self.last_timestamp = current_time
                
            log_entry = {
                'timestamp': current_time.isoformat(),
                'level': record.levelname,
                'logger': record.name,
                'message': self.format(record),
                'filename': record.filename,
                'lineno': record.lineno
            }
            # Send log to all connected clients
            self.socketio.emit('solver_log', log_entry)
        except Exception as e:
            print(f"Error sending log: {str(e)}")  # Fallback to print if logging fails

# Set up WebSocket log handler
ws_handler = WebSocketLogHandler(socketio)
ws_handler.setLevel(logging.INFO)
class RightAlignedTimestampFormatter(logging.Formatter):
    def format(self, record):
        message = record.getMessage()
        return f"{message}"

ws_handler.setFormatter(RightAlignedTimestampFormatter())

# Add filter to root logger
root_logger = logging.getLogger()
root_logger.addFilter(WebSocketFilter())

# Only add the handler to the root logger
root_logger.addHandler(ws_handler)

# Remove the handler from other loggers
for logger_name in logging.root.manager.loggerDict:
    if logger_name.startswith('rubikscubennnsolver'):
        logger = logging.getLogger(logger_name)
        logger.propagate = True  # Ensure logs propagate to root logger

class CubeAPIWrapper:
    """Wrapper class to manage cube instances with real cube solver"""
    
    def __init__(self):
        self.cubes = {}
        self.socketio = socketio  # Store socketio instance for sending messages
    
    def send_ui_message(self, message: str, level: str = "INFO"):
        """Send a user-friendly message to the UI"""
        try:
            log_entry = {
                'timestamp': datetime.now().isoformat(),
                'level': level,
                'message': message
            }
            self.socketio.emit('solver_log', log_entry)
        except Exception as e:
            print(f"Error sending UI message: {str(e)}")
    
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
            
            self.send_ui_message(f"Created {size}x{size}x{size} cube")
            return cube_id
            
        except Exception as e:
            self.send_ui_message(f"Failed to create cube: {str(e)}", "ERROR")
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

    def solve_cube(self, cube_id: str, solution333: Optional[List[str]] = None, solver_type: str = "Kociemba"):
        """Solve the cube and send progress updates to UI"""
        try:
            cube = self.get_cube(cube_id)
            cube_info = self.get_cube_info(cube_id)
            cube_size = cube_info['size']
            
            # Check if solver type is supported for this cube size
            if solver_type != "Kociemba" and cube_size > 3:
                raise ValueError(f"{solver_type} solver only supports 2x2x2 and 3x3x3 cubes")
            
            # Store original state for verification
            original_state = cube.get_kociemba_string(True)
            
            # Send solving start event
            self.send_ui_message(f"Starting {solver_type} solve for {cube_size}x{cube_size}x{cube_size} cube...")
            
            # Override cube's print methods to send UI messages
            original_print_cube = cube.print_cube
            original_print_cube_add_comment = cube.print_cube_add_comment
            
            def new_print_cube(title: str, print_positions: bool = False):
                self.send_ui_message(title)
                self.send_ui_message(cube.get_kociemba_string(True), "CUBE")
                # Don't call original_print_cube to prevent duplicate output
                return
            
            def new_print_cube_add_comment(desc: str, prev_solution_len: int):
                total_len = cube.get_solution_len_minus_rotates(cube.solution)
                solution_this_phase = cube.solution[prev_solution_len:]
                solution_this_phase_len = cube.get_solution_len_minus_rotates(solution_this_phase)
                message = f"{desc}: {solution_this_phase_len} steps, {total_len} total steps"
                self.send_ui_message(message)
                return original_print_cube_add_comment(desc, prev_solution_len)
            
            # Replace print methods
            cube.print_cube = new_print_cube
            cube.print_cube_add_comment = new_print_cube_add_comment
            
            # Solve the cube based on solver type
            cube.solve()
            
            solution = cube.get_solution()
            
            # Restore original print methods
            cube.print_cube = original_print_cube
            cube.print_cube_add_comment = original_print_cube_add_comment
            
            # Send solving complete event
            self.send_ui_message(f"{solver_type} solve completed with {len(solution)} moves", "SUCCESS")
            
            return {
                'success': True,
                'cube_id': cube_id,
                'solution': solution,
                'solution_length': len(solution),
                'original_state': original_state,
                'solved_state': cube.get_kociemba_string(True),
                'solved': cube.solved()
            }
            
        except SolveError as e:
            self.send_ui_message(f"Solve error: {str(e)}", "ERROR")
            raise
        except Exception as e:
            self.send_ui_message(f"Error solving cube: {str(e)}", "ERROR")
            raise

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
        solver_type = data.get('type', 'Kociemba')
        
        if isinstance(solution333, str):
            solution333 = reverse_steps(solution333.split())
        elif solution333:
            solution333 = reverse_steps(solution333)
            
        result = cube_manager.solve_cube(cube_id, solution333, solver_type)
        return jsonify(result)
    
    except SolveError as e:
        return jsonify({'error': f'Solve error: {str(e)}'}), 400
    except Exception as e:
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

@socketio.on('connect')
def handle_connect():
    logger.info('Client connected to WebSocket')
    emit('connected', {'message': 'Connected to solver logs'})

@socketio.on('disconnect')
def handle_disconnect():
    logger.info('Client disconnected from WebSocket')

if __name__ == '__main__':
    logger.info("Starting Rubik's Cube API Server with WebSocket support")
    socketio.run(app, host='0.0.0.0', port=5175, debug=True, allow_unsafe_werkzeug=True)