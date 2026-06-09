import { spawn } from "child_process";
import path from "path";

export interface ClassificationResult {
  topic_group: string;
  confidence: number;
  probabilities?: Record<string, number>;
}

const PYTHON = process.env.PYTHON_PATH || "python";

const CLASSIFY_SCRIPT = path.join(/* turbopackIgnore: true */ process.cwd(), "ml", "classify.py");

export async function classifyText(text: string): Promise<ClassificationResult> {
  return new Promise((resolve, reject) => {
    const py = spawn(PYTHON, [CLASSIFY_SCRIPT], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    py.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    py.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `classify.py exit ${code}`));
        return;
      }
      try {
        const parsed = JSON.parse(stdout.trim()) as ClassificationResult & { error?: string };
        if (parsed.error) reject(new Error(parsed.error));
        else resolve(parsed);
      } catch {
        reject(new Error(`Resposta invalida do classificador: ${stdout}`));
      }
    });

    py.stdin.write(JSON.stringify({ text }));
    py.stdin.end();
  });
}
