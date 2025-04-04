import fs from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

type TResult = { status: "success" | "failure" };

const STORAGE_PATH = join(
  fileURLToPath(import.meta.url),
  "../../../storage/storage.json"
);

// const delay = (ms: number = 3000) =>
//   new Promise((resolve) => {
//     setTimeout(() => resolve("Done!"), ms);
//   });

export async function readStorage<T>(): Promise<T | null> {
  try {
    const file = await fs.readFile(STORAGE_PATH, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    console.error(`Read storage error: ${error}`);
    return null;
  }
}

export async function writeStorage(data: unknown): Promise<TResult> {
  try {
    const file = JSON.stringify(data);
    await fs.writeFile(STORAGE_PATH, file);
    return { status: "success" };
  } catch (error) {
    console.error(`Write storage error: ${error}`);
    return { status: "failure" };
  }
}
