/** Worker entry point. Called once at server startup.
 *  In production (docker), this runs inside the same Node process as Next.js.
 *  In dev, workers start when the first request hits the app via instrumentation. */
import { startWorkers } from "@/lib/queue";

let started = false;

export function ensureWorkers() {
  if (started) return;
  started = true;
  if (process.env.REDIS_URL) {
    startWorkers();
  }
}
