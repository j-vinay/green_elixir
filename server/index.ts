// server/index.ts
import "dotenv/config"; // <- ensure env variables are loaded before other modules import them

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple request logger that captures JSON responses for /api routes
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore - preserve runtime behavior
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch {
          // ignore stringify errors
        }
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // register routes and get the underlying http.Server-like instance
  const server = await registerRoutes(app);

  // central error handler (keeps your previous behavior)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    // Re-throw so the error surfaces in logs (optional)
    throw err;
  });

  // Setup Vite dev server or serve static client build
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);

  // Start server with optional reusePort; fallback when not supported (e.g. Windows)
  async function startServer() {
    const opts = {
      port,
      host: "127.0.0.1",
    };

    // Try listen with reusePort first, then fallback if the platform throws ENOTSUP
    try {
      // @ts-ignore - some TS libs may not include reusePort on ListenOptions, but Node supports it at runtime on supported platforms.
      await new Promise<void>((resolve, reject) => {
        server
          .listen({ ...opts, reusePort: true } as any, () => {
            log(`serving on port ${port} (reusePort enabled)`);
            resolve();
          })
          .once("error", (err: any) => reject(err));
      });
    } catch (err: any) {
      // If reusePort isn't supported, log and fallback to regular listen
      log(
        `reusePort failed (${err?.code ?? err?.message ?? err}). Falling back to normal listen.`
      );

      await new Promise<void>((resolve, reject) => {
        server
          .listen(opts.port, opts.host, () => {
            log(`serving on port ${port}`);
            resolve();
          })
          .once("error", (err: any) => reject(err));
      });
    }
  }

  // Start and handle start errors
  try {
    await startServer();
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
