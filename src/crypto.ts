import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes as generateRandomBytes,
  scryptSync,
  timingSafeEqual
} from 'crypto';
import {
  copyFileSync,
  createReadStream,
  createWriteStream,
  statSync,
} from 'fs';
import { basename, resolve as resolvePath } from 'path';
import {
  DECRYPTION_COMPLETED_MESSAGE,
  ENCRYPTION_COMPLETED_MESSAGE,
  getDecryptingMessage,
  getEncryptingMessage,
  getLargeFileWarningMessage
 } from './messages';
import { promptForContinuationConfirmation } from './prompt/prompt';
import { appendFile, cleanUpTemporaryFile, createTemporaryFile, readFile } from './utils/fileSystem';
import { logger } from './utils/logger';

/**
 * @description Generates a HMAC of a file based on `start` and `end`.
 * @param password The password for HMAC generation.
 * @param pathToInputFile The path to a file for HMAC generation.
 * @param start The position of the first byte generateHmac starts to read.
 * @param end The position of the last byte generateHmac starts to read.
 * @returns A promise containing the HMAC buffer generated.
 */
function generateHmac(
  password: string,
  pathToInputFile: string,
  start: number = 0,
  end: number = Infinity): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const hmac = createHmac('sha512', password);

      createReadStream(pathToInputFile, { start, end })
        .on('error', reject)
        .on('data', (data) => {
          hmac.update(data);
        })
        .once('end', () => {
          const digest = hmac.digest();
          hmac.end();

          resolve(digest);
        });
    });
}

/**
 * @description Encrypts a file then write the result to another file.
 * @param password The password for encryption.
 * @param pathToInputFile The path to a file to be ecrypted.
 * @param pathToOutputFile The path to a file which the encrypted data will be written to.
 * @returns A promise containing void.
 */
function encrypt(password: string, pathToInputFile: string, pathToOutputFile: string): Promise<void>  {
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(pathToInputFile)
      .on('error', reject);

    const writeStream = createWriteStream(pathToOutputFile, { flags: 'a' })
      .on('error', reject)
      .once('close', resolve);

    const passwordSalt = generateRandomBytes(16);
    const iv = generateRandomBytes(16);

    const key = scryptSync(password, passwordSalt, 16);
    const keyString = key.toString('hex');

    const cipher = createCipheriv('aes-256-cbc', keyString, iv)
      .on('error', reject);

    writeStream.write(iv);
    writeStream.write(passwordSalt);

    readStream
      .pipe(cipher)
      .pipe(writeStream);
  });
}

/**
 * @description Decrypts a file then write the result to another file.
 * @param password The password for decryption.
 * @param pathToInputFile The path to a file to be decrypted.
 * @param pathToOutputFile The path to a file which the decrypted data will be written to.
 * @returns A promise containing void.
 */
function decrypt(password: string, pathToInputFile: string, pathToOutputFile: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const fileStats = statSync(pathToInputFile);
    const fileSize = fileStats.size;

    const readStream = createReadStream(pathToInputFile, { start: 32, end: fileSize - 65 })
      .on('error', reject);

    const writeStream = createWriteStream(pathToOutputFile)
      .on('error', reject)
      .once('close', resolve);

    (async () => {
      try {
        const iv = await readFile(pathToInputFile, 0, 15);
        const passwordSalt = await readFile(pathToInputFile, 16, 31);

        const key = scryptSync(password, passwordSalt, 16);
        const keyString = key.toString('hex');

        const decipher = createDecipheriv('aes-256-cbc', keyString, iv)
          .on('error', reject);

        readStream
          .pipe(decipher)
          .pipe(writeStream);
      } catch (error) {
        reject(error);

        return;
      }
    })();
  });
}

/**
 * @description Encrypts a file with the `encrypt` function.
 * @param password The password for encryption.
 * @param pathToInputFile The path to a file to be encrypted.
 * @returns A promise containing void.
 */
export async function encryptFile(password: string, pathToTargetFile: string): Promise<void> {
  const absolutePathToTargetFile = resolvePath(pathToTargetFile);

  const fileStats = statSync(absolutePathToTargetFile);
  const fileSize = fileStats.size;
  const isDirectory = fileStats.isDirectory();

  if (isDirectory) {
    throw {
      code: 'ERR_DIRECTORY_NOT_SUPPORTED'
    };
  }

  if (fileSize >= 104857600) {
    // Warns the user if the file is larger than 100 MB.
    logger.warning(getLargeFileWarningMessage(fileSize));

    if (!((await promptForContinuationConfirmation()).shouldContinue)) {
      return;
    }
  }

  const fileBasename = basename(absolutePathToTargetFile);

  let pathToTemporaryFile: string;

  logger.info(getEncryptingMessage(fileBasename));

  try {
    pathToTemporaryFile = await createTemporaryFile(fileBasename);

    await encrypt(password, pathToTargetFile, pathToTemporaryFile);

    const digest = await generateHmac(password, pathToTemporaryFile);
    await appendFile(pathToTemporaryFile, digest);

    copyFileSync(pathToTemporaryFile, pathToTargetFile);

    logger.info(ENCRYPTION_COMPLETED_MESSAGE);
  } catch (error) {
    throw error;
  } finally {
    cleanUpTemporaryFile(pathToTemporaryFile);
  }
}

/**
 * @description Encrypts a file with the `decrypt` function.
 * @param password The password for decryption.
 * @param pathToInputFile The path to a file to be decrypted.
 * @returns A promise containing void.
 */
export async function decryptFile(password: string, pathToTargetFile: string) {
  const absolutePathToTargetFile = resolvePath(pathToTargetFile);

  const fileStats = statSync(absolutePathToTargetFile);
  const fileSize = fileStats.size;
  const isDirectory = fileStats.isDirectory();

  if (isDirectory) {
    throw {
      code: 'ERR_DIRECTORY_NOT_SUPPORTED'
    };
  }

  if (fileSize >= 104857600) {
    // Warns the user if the file is larger than 100 MB.
    logger.warning(getLargeFileWarningMessage(fileSize));

    if (!((await promptForContinuationConfirmation()).shouldContinue)) {
      return;
    }
  }

  const fileBasename = basename(absolutePathToTargetFile);

  let pathToTemporaryFile: string;

  logger.info(getDecryptingMessage(fileBasename));

  try {

    pathToTemporaryFile = await createTemporaryFile(fileBasename);

    const digestInFile = await readFile(pathToTargetFile, fileSize - 64);
    const digest = await generateHmac(password, pathToTargetFile, 0, fileSize - 65);

    if (!timingSafeEqual(digestInFile, digest)) {
      throw {
        code: 'ERR_HMAC_MISMATCH'
      };
    }

    await decrypt(password, pathToTargetFile, pathToTemporaryFile);

    copyFileSync(pathToTemporaryFile, pathToTargetFile);

    logger.info(DECRYPTION_COMPLETED_MESSAGE);
  } catch (error) {
    throw error;
  } finally {
    cleanUpTemporaryFile(pathToTemporaryFile);
  }
}
