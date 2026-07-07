import "dotenv/config";
import { execSync } from "child_process";

const port = String(process.argv[2] || process.env.PORT || 5000);

function killPortWindows(targetPort) {
  try {
    const output = execSync(`netstat -ano | findstr :${targetPort}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });

    const pids = new Set();

    for (const line of output.trim().split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.includes("LISTENING")) continue;

      const parts = trimmed.split(/\s+/);
      const pid = parts[parts.length - 1];

      if (pid && pid !== "0" && /^\d+$/.test(pid)) {
        pids.add(pid);
      }
    }

    if (pids.size === 0) {
      console.log(`No process listening on port ${targetPort}.`);
      return;
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Freed port ${targetPort} (stopped PID ${pid})`);
      } catch {
        console.warn(`Could not stop PID ${pid} on port ${targetPort}.`);
      }
    }
  } catch {
    console.log(`Port ${targetPort} is free.`);
  }
}

function killPortUnix(targetPort) {
  try {
    const pid = execSync(`lsof -ti tcp:${targetPort}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();

    if (!pid) {
      console.log(`No process listening on port ${targetPort}.`);
      return;
    }

    execSync(`kill -9 ${pid}`, { stdio: "ignore" });
    console.log(`Freed port ${targetPort} (stopped PID ${pid})`);
  } catch {
    console.log(`Port ${targetPort} is free.`);
  }
}

if (process.platform === "win32") {
  killPortWindows(port);
} else {
  killPortUnix(port);
}
