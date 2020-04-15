import {
  createReadStream,
  rmdirSync,
  unlinkSync,
  writeFile,
  writeFileSync
} from 'fs';
import { dirname, join } from 'path';
import { dir, setGracefulCleanup } from 'tmp-promise';

/**
 * @description Creates a temporary file based on `fileName`.
 * @param fileName The name of the temporary file to create.
 * @returns A promise containing `ICreateTemporaryFileResult`.
 */
export async function createTemporaryFile(fileName: string): Promise<string> {
  // Ask tmp-promise to delete the created temporary file even on failure.
  setGracefulCleanup();

  const { path: pathToTemporaryDirectory } = await dir({ prefix: 'sekreto-' });

  const pathToTemporaryFile = join(pathToTemporaryDirectory, fileName);

  writeFileSync(pathToTemporaryFile, '');

  return pathToTemporaryFile;
}

/**
 * @description Cleans (deletes) the file and the directory containing the file.
 * @param pathToTemporaryFile The path to the file to be deleted.
 * @returns void.
 */
export function cleanUpTemporaryFile(pathToTemporaryFile) {
  const pathToTemporaryDirectory = dirname(pathToTemporaryFile);

  unlinkSync(pathToTemporaryFile);
  rmdirSync(pathToTemporaryDirectory);
}

/**
 * @description Reads data of a file based on `start` and `to`
 * @param pathToTargetFile The path to a file to be read.
 * @param start The position of the first byte readFile starts to read.
 * @param end The position of the last byte readFile starts to read.
 * @returns A promise containing the buffer read.
 */
export function readFile(pathToTargetFile: string, start: number = 0, end: number = Infinity): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];

    createReadStream(pathToTargetFile, { start, end })
      .on('error', reject)
      .on('data', (data) => {
        buffers.push(data);
      })
      .once('close', () => {
        resolve(Buffer.concat(buffers));
      });
  });
}

export function appendFile(pathToTargetFile: string, data: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(pathToTargetFile, data, { flag: 'a' }, (error) => {
      if (error) {
        reject(error);

        return;
      }

      resolve();
    });
  });
}
