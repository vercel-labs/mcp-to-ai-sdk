export function urlToPath(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove protocol and convert to filesystem-safe path
    let path = parsed.hostname + parsed.pathname;
    // Replace invalid filesystem characters
    path = path.replace(/[^\w\-_.\/]/g, "_");
    // Remove trailing slashes and ensure no double slashes
    path = path.replace(/\/+/g, "/").replace(/\/$/, "");
    return path || parsed.hostname;
  } catch {
    // If not a URL, sanitize as file path
    return url.replace(/[^\w\-_.\/]/g, "_");
  }
}

export function parseHeader(headerArg: string): [string, string] {
  const colonIndex = headerArg.indexOf(':');
  if (colonIndex === -1) {
    throw new Error(`Invalid header format: ${headerArg}. Expected "Header: value"`);
  }
  const key = headerArg.substring(0, colonIndex).trim();
  const value = headerArg.substring(colonIndex + 1).trim();
  if (!key || !value) {
    throw new Error(`Invalid header format: ${headerArg}. Expected "Header: value"`);
  }
  return [key, value];
}