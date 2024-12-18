import { serveStatic } from "hono/bun";
import { Hono } from "hono";
import { renderPage } from "./utils";

const app = new Hono();

app.use("*", serveStatic({ root: "/src/public" }));

app.get("/", async (c) => {
  const html = await renderPage("index");
  return c.html(html);
});

export default app;
