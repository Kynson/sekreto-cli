import { prompt } from './prompt';

const { process, answers } = prompt();

process.subscribe(null, (err) => console.log(err), () => console.log('hi'))
