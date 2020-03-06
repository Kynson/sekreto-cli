import { ListQuestion, InputQuestion, PasswordQuestion, prompt } from 'inquirer';
import { Subject } from 'rxjs';

import { resolve as resolvePath } from 'path';

type Service = 'encrypt' | 'decrypt';

interface Config {
  service: Service,
  absolutePathToFileOrDirectory: string,
  password: string
}

const promptSubject: Subject<ListQuestion | InputQuestion | PasswordQuestion> = new Subject();

const { ui: promptUI } = prompt<Config>(promptSubject);
const { answers: promptUIAnswers, process: promptUIProcess } = promptUI;

let config: Config = {
  service: null,
  absolutePathToFileOrDirectory: null,
  password: null
};

function onPromptUIProcessComplete() {
  config = promptUIAnswers as Config;
}

promptUIProcess.subscribe(null, (err) => console.log(err), onPromptUIProcessComplete);

promptSubject.next({
  choices: ['Encrypt', 'Decrypt'],
  filter: (input: string) => {
    return input.toLowerCase();
  },
  message: 'Please select a service:',
  name: 'service',
  type: 'list'
});

promptSubject.next({
  filter: (input: string) => {
    return resolvePath(input);
  },
  message: 'Please enter the path to the file/directory you would like Sekreto to process:',
  name: 'absolutePathToFileOrDirectory',
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
  message: 'Please enter your password (At least 8 charactors):',
  name: 'password',
  validate: (input: string) => {
    if (!input) {
      return 'This field is required.';
    }

    if (input.length < 8) {
      return 'Password must be at least 8 charactors.'
    }

    return true;
  },
  type: 'password'
});

promptSubject.complete();
