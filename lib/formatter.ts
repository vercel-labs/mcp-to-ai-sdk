import * as prettier from 'prettier';
import { readFile } from 'fs/promises';
import { resolve, dirname, join } from 'path';

async function findPrettierConfig(startDir: string): Promise<prettier.Config | null> {
  try {
    const config = await prettier.resolveConfig(startDir, { useCache: false });
    return config;
  } catch (error) {
    // If prettier config resolution fails, return null to use defaults
    return null;
  }
}

export async function formatCode(code: string, filepath: string): Promise<string> {
  try {
    // Try to find prettier config starting from the directory where the file will be written
    const config = await findPrettierConfig(filepath);
    
    // Format the code with discovered config (or defaults if none found)
    const formatted = await prettier.format(code, {
      ...config,
      parser: 'typescript',
      filepath: filepath, // Help prettier determine the right parser
    });
    
    return formatted;
  } catch (error) {
    // If formatting fails, return the original code
    console.warn(`Warning: Could not format ${filepath}:`, error instanceof Error ? error.message : error);
    return code;
  }
}