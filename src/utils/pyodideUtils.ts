declare global {
    interface Window {
      loadPyodide: any;
      pyodide: any;
    }
  }
  
  let pyodide: any = null;
  
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
  
      await pyodide.loadPackage(["numpy", "pandas", "matplotlib"]);
      window.pyodide = pyodide;
    } else if (typeof window !== "undefined") {
      pyodide = window.pyodide;
    }
  };
  
  export const executePythonCode = async (code: string): Promise<{ output: string; plot?: string; plotlyData?: any }> => {
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
  
      // Get the captured output
      const output = pyodide.runPython('sys.stdout.getvalue()');
  
      // The result should be the base64 string of the plot
      const plot = typeof result === 'string' ? `data:image/png;base64,${result}` : undefined;
  
      // Reset stdout
      pyodide.runPython('sys.stdout = sys.__stdout__');
  
      return { output, plot };
    } catch (error) {
      console.error('Error in Python execution:', error);
      if (error instanceof Error) {
        return { output: `Error: ${error.message}` };
      }
      return { output: 'An unknown error occurred' };
    }
  };