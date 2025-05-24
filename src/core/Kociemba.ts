export class Kociemba {
  private apiUrl: string;
  public moves: string[] = [];              // Simulated as  move list from string
  public comparisonCount: number = 0;       // Not applicable, default 0
  public moveCount: number = 0;
  public timeTaken: number = 0;

  private state: string = "";
  private isSolving: boolean = false;

  constructor(apiUrl: string = "http://localhost:5000/solve") {
    this.apiUrl = apiUrl;
  }

  public setState(state: string) {
    this.state = state;
  }

  public async solve(): Promise<void> {
    if (this.isSolving) return;

    this.isSolving = true;
    const startTime = performance.now();

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: this.state }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Solver API error");
      }

      this.moves = data.solution.trim().split(/\s+/).slice(1);
      this.moveCount = this.moves.length;
    } catch (error: any) {
      console.error("Kociemba error:", error.message);
      this.moves = [];
      this.moveCount = 0;
    }

    const endTime = performance.now();
    this.timeTaken = endTime - startTime;
    this.isSolving = false;
  }
}
