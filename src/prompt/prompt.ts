import { prompt as inquirerPrompt } from 'inquirer';

import QUESTIONS from './QUESTIONS';

type SekretoService = 'encrypt' | 'decrypt';

interface ISekretoConfiguration {
  service: SekretoService;
  pathToFileOrDirectory: string;
  password: string;
  _passwordConfirmation: string;
}

export function prompt() {
  return inquirerPrompt<ISekretoConfiguration>(QUESTIONS);
}
