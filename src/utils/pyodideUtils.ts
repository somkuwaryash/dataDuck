declare global {
    interface Window {
      loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
      pyodide: PyodideInterface;
    }
  }
  
  interface PyodideInterface {
    loadPackage: (packages: string[]) => Promise<void>;
    runPythonAsync: (code: string) => Promise<unknown>;
    runPython: (code: string) => unknown;
  }
  
  let pyodide: PyodideInterface | null = null;
  
  export const initializePyodide = async (): Promise<void> => {
    if (typeof window !== "undefined" && !window.pyodide) {
      // Load Pyodide script
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
      document.head.appendChild(script);
  
      await new Promise((resolve) => {
        script.onload = resolve;
      });
  
      // Initialize Pyodide
      pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
      });
  
      await pyodide.loadPackage(["numpy", "pandas", "matplotlib", "scipy"]);
      window.pyodide = pyodide;
    } else if (typeof window !== "undefined") {
      pyodide = window.pyodide;
    }
  };
  
  export const executePythonCode = async (code: string): Promise<{ output: string; executionResult: string }> => {
    if (!pyodide) {
      throw new Error('Pyodide is not initialized');
    }
  
    try {
      console.log('Executing Python code:', code);
  
      // Import sys and set up stdout capture
      pyodide.runPython(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `);
  
      // Run the user's code
      const result = await pyodide.runPythonAsync(code);
      console.log('Python execution result:', result);
  
      // Get the captured output and convert it to a string
      const output = String(pyodide.runPython('sys.stdout.getvalue()'));
  
      // Reset stdout
      pyodide.runPython('sys.stdout = sys.__stdout__');
  
      // Convert the result to a string if it's not already
      const executionResult = typeof result === 'string' ? result : JSON.stringify(result);
  
      return { output, executionResult };
    } catch (error) {
      console.error('Error in Python execution:', error);
      if (error instanceof Error) {
        return { output: `Error: ${error.message}`, executionResult: '' };
      }
      return { output: 'An unknown error occurred', executionResult: '' };
    }
  };