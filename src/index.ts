import { decryptFile, encryptFile } from './crypto';
import {
  DEFAULT_ERROR_MESSAGE,
  DIRECTORY_NOT_SUPPORTED_ERROR_MESSAGE,
  HMAC_MISMATCH_ERROR_MESSAGE,
  NO_SUCH_FILE_ERROR_MESSAGE,
  PERMISSION_DENIED_ERROR_MESSAGE
} from './messages';
import { promptForConfiguration } from './prompt/prompt';
import { logger } from './utils/logger';

promptForConfiguration().
  then(async (configuration) => {
    if (configuration.service === 'encrypt') {
      return encryptFile(configuration.password, configuration.pathToTargetFile);
    }

    return decryptFile(configuration.password, configuration.pathToTargetFile);
  })
  .catch((error) => {
    if (error.code) {
      switch (error.code) {
        case 'EACCES':
          logger.error(PERMISSION_DENIED_ERROR_MESSAGE);

          if (error.path) {
            logger.native(error.path);
          }
          break;
        case 'ENOENT':
          logger.error(NO_SUCH_FILE_ERROR_MESSAGE);

          if (error.path) {
            logger.native(error.path);
          }
          break;
        case 'ERR_HMAC_MISMATCH':
          logger.error(HMAC_MISMATCH_ERROR_MESSAGE);
          break;
        case 'ERR_DIRECTORY_NOT_SUPPORTED':
          logger.error(DIRECTORY_NOT_SUPPORTED_ERROR_MESSAGE);
          break;
        default:
          logger.error(DEFAULT_ERROR_MESSAGE);
          logger.native(error);
          break;
      }

      return;
    }

    logger.error(DEFAULT_ERROR_MESSAGE);
    logger.native(error);
  });
