import { prompt as inquirerPrompt } from 'inquirer';
import { questionForContinuationConfirmation, questionsForConfiguration } from './questions';

type SekretoService = 'encrypt' | 'decrypt';

interface IContinuationConfirmation {
  shouldContinue: boolean;
}

interface ISekretoConfiguration {
  service: SekretoService;
  pathToTargetFileOrDirectory: string;
  password: string;
  _passwordConfirmation: string;
}

export function promptForContinuationConfirmation() {
  return inquirerPrompt<IContinuationConfirmation>(questionForContinuationConfirmation);
}

export function promptForConfiguration() {
  return inquirerPrompt<ISekretoConfiguration>(questionsForConfiguration);
}
