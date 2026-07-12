/**
 * TransitOps Export Utilities
 * ──────────────────────────
 * All file-generation and browser-download primitives live here.
 * Services call these helpers; page components never import this directly.
 *
 * Supported formats: CSV, JSON
 * Architecture: USE_MOCK_DATA=true → generate locally; false → stream from backend.
 */

import dayjs from 'dayjs';

// ─────────────────────────────────────────────────────────────────────────────
// 1. FILENAME HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a consistent export filename with today's date stamp.
 * @param {string} base - The descriptive base name (e.g. 'vehicles', 'analytics_report')
 * @param {string} format - File extension without dot (e.g. 'csv', 'json', 'xlsx', 'pdf')
 * @returns {string} - e.g. 'vehicles_2026-07-12.csv'
 */
export function getExportFilename(base, format = 'csv') {
  const date = dayjs().format('YYYY-MM-DD');
  return `${base}_${date}.${format}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CSV SERIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Escape a single CSV cell value.
 * Rules: wrap in quotes if the value contains commas, newlines, or double-quotes.
 * Always replace null/undefined with empty string.
 * @param {*} value
 * @returns {string}
 */
function escapeCsvCell(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Escape internal double-quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  // Wrap in double-quotes if the value contains comma, newline, or double-quote
  if (/[",\n\r]/.test(str)) {
    return `"${escaped}"`;
  }
  return escaped;
}

/**
 * Convert an array of plain objects to a CSV string.
 * The first object's keys become the header row.
 * Handles null values, empty arrays, and UTF-8 encoding.
 *
 * @param {object[]} rows - Array of flat or shallow objects
 * @param {string[]} [headers] - Optional explicit ordered header keys
 * @returns {string} Full CSV text with CRLF line endings
 */
export function objectsToCSV(rows, headers) {
  if (!rows || rows.length === 0) {
    throw new Error('No data available to export.');
  }

  // Determine column order
  const keys = headers || Object.keys(rows[0]);

  // Header row (human-readable: snake_case → Title Case)
  const headerRow = keys
    .map((k) => {
      const label = k
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
      return escapeCsvCell(label);
    })
    .join(',');

  // Data rows
  const dataRows = rows.map((row) =>
    keys.map((k) => escapeCsvCell(row[k])).join(',')
  );

  // Join with CRLF (RFC 4180 standard)
  return [headerRow, ...dataRows].join('\r\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. JSON SERIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Serialize an array of objects to a pretty-printed JSON string.
 * @param {object[]} rows
 * @returns {string}
 */
export function objectsToJSON(rows) {
  if (!rows || rows.length === 0) {
    throw new Error('No data available to export.');
  }
  return JSON.stringify(rows, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. BROWSER DOWNLOAD TRIGGER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Trigger a browser file download from a Blob object.
 * Creates a temporary anchor element, clicks it, then cleans up immediately.
 * Revokes the Object URL to prevent memory leaks.
 *
 * @param {Blob} blob        - The file data as a Blob
 * @param {string} filename  - The name the user will see in the save dialog
 */
export function downloadBlob(blob, filename) {
  if (!(blob instanceof Blob)) {
    throw new TypeError('downloadBlob: first argument must be a Blob instance.');
  }

  // Create a temporary object URL
  const url = URL.createObjectURL(blob);

  // Create a hidden anchor element, click it, then remove it
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  // Revoke the URL after a short delay so the download can start
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. HIGH-LEVEL EXPORT ORCHESTRATOR (Mock Mode)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a local file and trigger download.
 * Used in mock mode — no network request required.
 *
 * @param {object[]} rows     - Array of objects to serialize
 * @param {string} baseName   - Base filename (e.g. 'vehicles')
 * @param {'csv'|'json'} format - Output format
 */
export function exportLocalData(rows, baseName, format = 'csv') {
  if (!rows || rows.length === 0) {
    throw new Error('No data available to export. The dataset is empty.');
  }

  let content;
  let mimeType;

  if (format === 'json') {
    content = objectsToJSON(rows);
    mimeType = 'application/json';
  } else {
    // Default: CSV
    content = objectsToCSV(rows);
    mimeType = 'text/csv;charset=utf-8;';
  }

  // Add UTF-8 BOM for CSV so Excel opens it correctly
  const bom = format === 'csv' ? '\uFEFF' : '';
  const blob = new Blob([bom + content], { type: mimeType });
  const filename = getExportFilename(baseName, format);

  downloadBlob(blob, filename);

  return filename;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. BACKEND BLOB DOWNLOAD (Production Mode)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Download a binary file received from a backend API.
 * The axios response must have been requested with { responseType: 'blob' }.
 *
 * @param {AxiosResponse} response - Axios response with blob data
 * @param {string} baseName        - Base filename (e.g. 'vehicles')
 * @param {'csv'|'json'|'xlsx'|'pdf'} format
 */
export function downloadApiBlob(response, baseName, format = 'csv') {
  // Prefer Content-Disposition filename if backend provides one
  const disposition = response.headers?.['content-disposition'];
  let filename;
  if (disposition) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    filename = match ? match[1].replace(/['"]/g, '').trim() : null;
  }
  if (!filename) {
    filename = getExportFilename(baseName, format);
  }

  const blob = new Blob([response.data], {
    type: response.headers?.['content-type'] || 'application/octet-stream',
  });
  downloadBlob(blob, filename);

  return filename;
}
