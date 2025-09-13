exports.parseRequest = (req, res, next) => {
  try {
    req.body = parseDataStructure(req.body);
    req.params = parseDataStructure(req.params);
    req.query = parseDataStructure(req.query);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Safely parses a single value from string to its appropriate type
 * - Numbers
 * - Booleans
 * - JSON Objects/Arrays
 * - Leaves everything else as string
 */
function parseValue(value) {
  if (value === null || value === undefined) return value;
  if (typeof value !== "string") return value; // already parsed by multer or other middleware

  const trimmed = value.trim();

  // if true or false with spaces arround
  if (/^(true|false)$/i.test(trimmed)) {
    return trimmed.toLowerCase() === "true";
  }

  // Number parsing (only integers/floats, not strings like "0123abc")
  if (!isNaN(trimmed) && trimmed !== "") {
    return Number(trimmed);
  }

  // if it's either object or array use JSON.parse
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return value;
    }
  }

  return value;
}

// Recursively parses all keys in an object or array
function parseDataStructure(data) {
  if (Array.isArray(data)) {
    return data.map(parseDataStructure);
  }

  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([key, val]) => [key, parseDataStructure(val)])
    );
  }

  return parseValue(data);
}
