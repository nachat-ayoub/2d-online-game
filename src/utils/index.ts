import * as path from "path";
import * as fs from "fs/promises";

export const TEMPLATES_PATH = path.resolve("src", "client");

export async function renderPage(fileName: string) {
  const filePath = path.join(TEMPLATES_PATH, fileName + ".html");
  const html = await fs.readFile(filePath, "utf-8");
  return html;
}
