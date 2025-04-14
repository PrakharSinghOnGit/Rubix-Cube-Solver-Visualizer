declare global {
  interface Window {
    createModule: () => Promise<any>;
  }
}

let func: (a: number, b: number) => number;

export async function initWasm() {
  const module = await window.createModule();
  func = module.cwrap("func", "number", ["number", "number"]);
}

export function addNumbers(a: number, b: number): number {
  if (!func) throw new Error("WASM not initialized");
  return func(a, b);
}
