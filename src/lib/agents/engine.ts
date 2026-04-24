export class AgentEngine {
  static async runAnalysis(ticker: string): Promise<string> {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker }),
    });

    if (!res.ok) {
      throw new Error(`Analysis failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.report as string;
  }
}
