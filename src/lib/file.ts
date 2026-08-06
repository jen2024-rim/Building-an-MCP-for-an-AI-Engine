import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

function resolveSafePath(fileName: string): string {
  if (fileName.includes("..")) {
    throw new Error(`Invalid file name: "${fileName}" is not allowed.`);
  }

  const filePath = path.resolve(DATA_DIR, fileName);

  if (filePath !== DATA_DIR && !filePath.startsWith(DATA_DIR + path.sep)) {
    throw new Error(`Refusing to access outside of /data: "${fileName}"`);
  }

  return filePath;
}

/**
 * Reads a JSON file — but ONLY from inside the /data directory.
 */
export async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = resolveSafePath(fileName);

  let fileContent: string;
  try {
    fileContent = await readFile(filePath, "utf-8");
  } catch (err) {
    throw new Error(`Failed to read ${fileName} from /data: ${(err as Error).message}`);
  }

  if (!fileContent.trim()) {
    throw new Error(`File ${fileName} is empty.`);
  }

  try {
    return JSON.parse(fileContent) as T;
  } catch (err) {
    throw new Error(`Failed to parse ${fileName} as JSON: ${(err as Error).message}`);
  }
}

/**
 * Writes a JSON file — but ONLY inside the /data directory.
 * Used by tools that need to persist changes (e.g. add_course_to_plan).
 */
export async function writeJsonFile<T>(fileName: string, data: T): Promise<void> {
  const filePath = resolveSafePath(fileName);

  try {
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    throw new Error(`Failed to write ${fileName} to /data: ${(err as Error).message}`);
  }
}