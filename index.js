// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/huggingface.ts
import axios from "axios";
async function classifyImageWithHuggingFace(imageBuffer) {
  try {
    console.log("Classifying image with Hugging Face API");
    const base64Image = imageBuffer.toString("base64");
    const response = await axios({
      method: "post",
      url: "https://api-inference.huggingface.co/models/rootstrap-org/waste-classifier",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY || ""}`,
        "Content-Type": "application/json"
      },
      data: {
        inputs: {
          image: base64Image
        }
      },
      timeout: 3e4
      // 30 seconds timeout
    });
    console.log("Hugging Face API response:", JSON.stringify(response.data));
    const classifications = response.data;
    if (!Array.isArray(classifications) || classifications.length === 0) {
      throw new Error("Invalid response from Hugging Face API");
    }
    const highestScore = classifications.reduce(
      (prev, current) => current.score > prev.score ? current : prev
    );
    const validCategories = ["plastic", "paper", "glass", "metal", "organic"];
    const category = highestScore.label.toLowerCase();
    if (!validCategories.includes(category)) {
      console.warn(`Hugging Face returned an unrecognized category: ${category}`);
      const defaultCategory = "plastic";
      return { category: defaultCategory };
    }
    return { category };
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    throw error;
  }
}

// server/mock.ts
async function mockClassification(imageBuffer) {
  console.log("Using mock classification service");
  const categories = ["plastic", "paper", "glass", "metal", "organic"];
  await new Promise((resolve) => setTimeout(resolve, 1e3));
  const randomIndex = Math.floor(Math.random() * categories.length);
  const category = categories[randomIndex];
  console.log(`Mock classified image as: ${category}`);
  return { category };
}

// shared/schema.ts
import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var WasteCategories = ["plastic", "paper", "glass", "metal", "organic"];
var classificationSchema = z.object({
  category: z.enum(WasteCategories)
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/routes.ts
import multer from "multer";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  }
});
async function registerRoutes(app2) {
  app2.post("/api/classify", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image provided" });
      }
      const imageBuffer = req.file.buffer;
      try {
        console.log("Attempting classification with Hugging Face API...");
        const result = await classifyImageWithHuggingFace(imageBuffer);
        const validatedResult = classificationSchema.parse(result);
        return res.status(200).json(validatedResult);
      } catch (error) {
        console.error("Hugging Face API error:", error);
        if (process.env.NODE_ENV === "development") {
          console.log("Falling back to mock classification for development...");
          try {
            const mockResult = await mockClassification(imageBuffer);
            const validatedResult = classificationSchema.parse(mockResult);
            return res.status(200).json(validatedResult);
          } catch (mockError) {
            console.error("Mock classification error:", mockError);
            throw mockError;
          }
        }
        throw error;
      }
    } catch (error) {
      console.error("Classification error:", error);
      return res.status(500).json({
        message: "Failed to classify image",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  app2.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
