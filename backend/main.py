from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import subprocess

app = FastAPI()

class CubeState(BaseModel):
    state: str

@app.post("/solve")
def solve_cube(input_data: CubeState):
    try:
        result = subprocess.run(
            ["python3", "rubiks-cube-solver.py", "--state", input_data.state],
            capture_output=True,
            text=True,
            check=True
        )
        return { "solution": result.stdout.strip() }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Solver Error: {e.stderr.strip()}")