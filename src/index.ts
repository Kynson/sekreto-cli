import { Answers, ListQuestion, InputQuestion, PasswordQuestion, prompt as inquirerPrompt } from 'inquirer';

import { Subject, Observable } from 'rxjs';

type Service = 'encrypt' | 'decrypt';

interface Config {
  service: Service,
  pathToFileOrDirectory: string,
  password: string,
  _confirmPasword: string
}

interface PromptUILike {
  answers: Answers,
  process: Observable<Answers>
}

const promptSubject: Subject<ListQuestion | InputQuestion | PasswordQuestion> = new Subject();

let prompt: Promise<Config> & { ui: PromptUILike };
try {
  prompt = inquirerPrompt<Config>(promptSubject);
} catch (error) {

}

const { ui: promptUI } = prompt;
const { answers: promptUIAnswers, process: promptUIProcess } = promptUI;

const SERVICE_SELECTION_MESSAGE = 'Please select a service:';
const PATH_TO_FILE_OR_DIRECTORY_INPUT_MESSAGE = 'Please enter the path to the file/directory you would like Sekreto to process:';
const PASSWORD_INPUT_MESSAGE = `Please enter your password:`;
const PASSWORD_CONFIRMATION_INPUT_MESSAGE = `Please confirm you password:`;

let config: Config = {
  service: null,
  pathToFileOrDirectory: null,
  password: null,
  _confirmPasword: null
};

function onPromptUIProcessError(error: Error) {
  console.log(error);
}

function onPromptUIProcessComplete() {
  config = promptUIAnswers as Config;
}

promptUIProcess.subscribe(null, onPromptUIProcessError, onPromptUIProcessComplete);

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
