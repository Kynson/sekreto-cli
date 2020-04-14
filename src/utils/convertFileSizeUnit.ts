/**
 * @description Converts file size into suitable unit.
 * @param size The size of a file in bytes.
 * @returns The converted file size with a suitable unit append in a string.
 * @example
 * convertFileSizeUnit(10); // returns '10.000 bytes'
 * convertFileSizeUnit(1048576); // returns '1.000 MB'
 */
export default function convertFileSizeUnit(size: number): string {
  if (size < 1024) {
    return `${size} bytes`;
  }

  if (size < 1048576) {
    return `${(size / 1024).toFixed(3)} KB`;
  }

  if (size < 1073741824) {
    return `${(size / 1048576).toFixed(3)} MB`;
  }

  if (size < 1099511627776) {
    return `${(size / 1073741824).toFixed(3)} GB`;
  }

  return `${(size / 1099511627776).toFixed(3)} TB`;
}
