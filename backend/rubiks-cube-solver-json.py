#!/usr/bin/env python3
import json
import sys
import datetime as dt
import resource
from math import sqrt
from rubikscubennnsolver import SolveError
# ... other imports

def solve_cube_json(state, order="URFDLB"):
    try:
        start_time = dt.datetime.now()
        
        size = int(sqrt(len(state) / 6))
        
        # Create cube instance based on size
        if size == 3:
            from rubikscubennnsolver.RubiksCube333 import RubiksCube333
            cube = RubiksCube333(state, order)
        elif size == 4:
            from rubikscubennnsolver.RubiksCube444 import RubiksCube444
            cube = RubiksCube444(state, order)
        # ... other sizes
        
        cube.sanity_check()
        cube.solve()
        end_time = dt.datetime.now()
        
        # Extract solution moves
        solution_moves = [step for step in cube.solution if not step.startswith('COMMENT')]
        
        result = {
            'success': True,
            'solution': solution_moves,
            'move_count': len(solution_moves),
            'time_taken': str(end_time - start_time),
            'time_seconds': (end_time - start_time).total_seconds(),
            'memory_usage_bytes': resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
            'cube_size': f'{size}x{size}x{size}',
            'solved': cube.solved()
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(json.dumps({'success': False, 'error': 'Usage: python script.py <cube_state>'}))
        sys.exit(1)
    
    solve_cube_json(sys.argv[1])