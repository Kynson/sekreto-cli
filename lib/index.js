"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = require("inquirer");
const rxjs_1 = require("rxjs");
const path_1 = require("path");
const promptSubject = new rxjs_1.Subject();
const { ui: promptUI } = inquirer_1.prompt(promptSubject);
const { answers: promptUIAnswers, process: promptUIProcess } = promptUI;
let config = {
    service: null,
    absolutePathToFileOrDirectory: null,
    password: null
};
function onPromptUIProcessComplete() {
    config = promptUIAnswers;
}
promptUIProcess.subscribe(null, (err) => console.log(err), onPromptUIProcessComplete);
promptSubject.next({
    choices: ['Encrypt', 'Decrypt'],
    filter: (input) => {
        return input.toLowerCase();
    },
    message: 'Please select a service:',
    name: 'service',
    type: 'list'
});
promptSubject.next({
    filter: (input) => {
        return path_1.resolve(input);
    },
    message: 'Please enter the path to the file/directory you would like Sekreto to process:',
    name: 'absolutePathToFileOrDirectory',
    validate: (input) => {
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
    validate: (input) => {
        if (!input) {
            return 'This field is required.';
        }
        if (input.length < 8) {
            return 'Password must be at least 8 charactors.';
        }
        return true;
    },
    type: 'password'
});
promptSubject.complete();
