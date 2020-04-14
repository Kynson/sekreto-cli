import { Answers } from 'inquirer';
import {
  PASSWORD_CONFIRMATION_INPUT_MESSAGE,
  PASSWORD_INPUT_MESSAGE,
  PASSWORD_MISMATCH_ERROR_MESSAGE,
  PATH_TO_TARGET_FILE_INPUT_MESSAGE,
  REQUIRED_QUESTION_ERROR_MESSAGE,
  SERVICE_SELECTION_MESSAGE
} from '../messages';

export const questionsForConfiguration = [
  {
    choices: ['Encrypt', 'Decrypt'],
    filter(input: string) {
      return input.toLowerCase();
    },
    message: SERVICE_SELECTION_MESSAGE,
    name: 'service',
    type: 'list'
  },
  {
    message: PATH_TO_TARGET_FILE_INPUT_MESSAGE,
    name: 'pathToTargetFile',
    validate(input: string) {
      if (!input) {
        return REQUIRED_QUESTION_ERROR_MESSAGE;
      }

      return true;
    },
    type: 'input'
  },
  {
    mask: '*',
    message: PASSWORD_INPUT_MESSAGE,
    name: 'password',
    validate(input: string) {
      if (!input) {
        return REQUIRED_QUESTION_ERROR_MESSAGE;
      }

      return true;
    },
    type: 'password'
  },
  {
    mask: '*',
    message: PASSWORD_CONFIRMATION_INPUT_MESSAGE,
    name: '_passwordConfirmation',
    validate(input: string, answers: Answers) {
      if (!input) {
        return REQUIRED_QUESTION_ERROR_MESSAGE;
      }

      if (input !== answers.password) {
        return PASSWORD_MISMATCH_ERROR_MESSAGE;
      }

      return true;
    },
    type: 'password',
    when(answers: Answers) {
      return answers.service === 'encrypt';
    }
  }
];

export const questionForContinuationConfirmation = [
  {
    default: false,
    message: 'Do you want to continue',
    name: 'shouldContinue',
    type: 'confirm'
  }
];
