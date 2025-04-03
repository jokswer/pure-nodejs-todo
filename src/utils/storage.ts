import fs from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const STORAGE_PATH = join(
  fileURLToPath(import.meta.url),
  "../../../storage/storage.json"
);

const delay = (ms: number = 3000) =>
  new Promise((resolve) => {
    setTimeout(() => resolve("Done!"), ms);
  });

export async function readStorage<T>(): Promise<T | null> {
  try {
    const file = await fs.readFile(STORAGE_PATH, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    console.error(`Read storage error: ${error}`);
    return null;
  }
}

export async function writeStorage(data: unknown) {
  try {
    const file = JSON.stringify(data);
    await delay();
    await fs.writeFile(STORAGE_PATH, file);
  } catch (error) {
    console.error(`Write storage error: ${error}`);
  }
}
