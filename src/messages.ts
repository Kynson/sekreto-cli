import { dim } from 'chalk';
import convertFileSizeUnit from './utils/convertFileSizeUnit';

export const SERVICE_SELECTION_MESSAGE = 'Please select a service:';
export const PATH_TO_TARGET_FILE_INPUT_MESSAGE = 'Please enter the path to the file you would like Sekreto to process:';
export const PASSWORD_INPUT_MESSAGE = 'Please enter your password:';
export const PASSWORD_CONFIRMATION_INPUT_MESSAGE = 'Please confirm you password:';

export const REQUIRED_QUESTION_ERROR_MESSAGE = 'This question is required.';
export const PASSWORD_MISMATCH_ERROR_MESSAGE = 'Password does not match.';

export const DEFAULT_ERROR_MESSAGE = 'We are sorry, something went wrong.';
export const PERMISSION_DENIED_ERROR_MESSAGE = 'Permission denied, fail to open file.';
export const NO_SUCH_FILE_ERROR_MESSAGE = 'Failed to open required file.';
export const HMAC_MISMATCH_ERROR_MESSAGE =
  `Fail to verify the integrity of the data. ${dim('(This may happen if your password is incorrect.)')}`;
export const DIRECTORY_NOT_SUPPORTED_ERROR_MESSAGE = 'Directory is not supported, please proivde a file.';

export const ENCRYPTION_COMPLETED_MESSAGE = 'Encryption completed.';
export const DECRYPTION_COMPLETED_MESSAGE = 'Decryption completed.';

export function getEncryptingMessage(fileName: string): string {
  return `Encrypting file ${fileName}.`;
}

export function getDecryptingMessage(fileName: string): string {
  return `Decrypting file ${fileName}.`;
}

export function getLargeFileWarningMessage(fileSize: number): string {
  return `We need ${convertFileSizeUnit(fileSize)} of storage for temporary file. ${dim('(It will be deleted after the process is finished.)')}`;
}
