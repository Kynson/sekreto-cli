import { Answers, ListQuestion, InputQuestion, PasswordQuestion, prompt as inquirerPrompt } from 'inquirer';

import { SERVICE_SELECTION_MESSAGE, PATH_TO_FILE_OR_DIRECTORY_INPUT_MESSAGE, PASSWORD_INPUT_MESSAGE, PASSWORD_CONFIRMATION_INPUT_MESSAGE } from './messages';

import { Subject, Observable } from 'rxjs';

type SekretoService = 'encrypt' | 'decrypt';

interface SekretoConfiguration {
  service: SekretoService,
  pathToFileOrDirectory: string,
  password: string,
  _confirmPasword: string
}

interface PromptUILike {
  answers: Answers,
  process: Observable<Answers>
}

export function prompt(): PromptUILike {
  const promptSubject: Subject<ListQuestion | InputQuestion | PasswordQuestion> = new Subject();

  let prompt: Promise<SekretoConfiguration> & { ui: PromptUILike };
  try {
    prompt = inquirerPrompt<SekretoConfiguration>(promptSubject);
  } catch (error) {

  }

  const { ui: promptUI } = prompt;

  promptSubject.next({
    choices: ['Encrypt', 'Decrypt'],
    filter: (input: string) => {
      return input.toLowerCase();
    },
    message: SERVICE_SELECTION_MESSAGE,
    name: 'service',
    type: 'list'
  });

  promptSubject.next({
    message: PATH_TO_FILE_OR_DIRECTORY_INPUT_MESSAGE,
    name: 'pathToFileOrDirectory',
    validate: (input: string) => {
      if (!input) {
        return 'This field is required.';
      }

      return true;
    },
    type: 'input'
  });

  promptSubject.next({
    mask: '*',
    message: PASSWORD_INPUT_MESSAGE,
    name: 'password',
    validate: (input: string) => {
      if (!input) {
        return 'This field is required.';
      }

      return true;
    },
    type: 'password'
  });

  promptSubject.next({
    mask: '*',
    message: PASSWORD_CONFIRMATION_INPUT_MESSAGE,
    name: '_confirmPasword',
    validate: (input: string, answers: Answers) => {
      if (!input) {
        return 'This field is required.';
      }

      if (input !== answers.password) {
        return 'Password does not match.'
      }

      return true;
    },
    type: 'password',
    when: (answers: Answers) => {
      return answers.service === 'encrypt';
    }
  });

  promptSubject.complete();

  return promptUI;
}
