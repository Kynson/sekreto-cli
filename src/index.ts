import { prompt } from './prompt/prompt';

import { logger } from './utils/logger';

import { DEFAULT_ERROR_MESSAGE } from './messages';

prompt().
  then(() => {
    logger.info('Initiate');
  }).
  catch((error) => {
    logger.error(DEFAULT_ERROR_MESSAGE);
  });
