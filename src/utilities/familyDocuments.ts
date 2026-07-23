import { promises as fs } from "node:fs";
import path from "node:path";

export interface FamilyDocument {
  filename: string;
  content: string;
}

export async function loadFamilyDocuments(): Promise<FamilyDocument[]> {
  const dataDirectory = path.resolve("data");

  let filenames: string[];

  try {
    filenames = await fs.readdir(dataDirectory);
  } catch (error) {
    throw new Error(
      `Could not read the data directory: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  const textFilenames = filenames.filter((filename) =>
    filename.toLowerCase().endsWith(".txt")
  );

  if (textFilenames.length === 0) {
    throw new Error("No .txt family documents were found in the data folder.");
  }

  const familyDocuments = await Promise.all(
    textFilenames.map(async (filename) => {
      const fullPath = path.join(dataDirectory, filename);
      const content = await fs.readFile(fullPath, "utf8");

      console.log(`Returning fileName: ${filename} with content length: ${content.length}`);
      return {
        filename,
        content
      };
    })
  )

  return familyDocuments;
}
