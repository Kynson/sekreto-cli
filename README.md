# Sekreto CLI
Sekreto CLI helps you keep your files secret. Sekreto CLI uses [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) algorithm with [HMAC-512](https://en.wikipedia.org/wiki/HMAC) to encrypt your files.

## Prerequisites
Sekreto CLI requires Node.js version 10 or later. You can install the latest version of Node.js at https://nodejs.org/en/download/.

Node.js version can be checked with the following command:
```
node --version
```

## Installation
You can install Sekreto CLI with the following command:
```
npm i -g sekreto-cli
```

## Usage
Run the following command to use Sekreto CLI, you will be prompted for information required.
```
sekreto
```

## License
[MIT](LICENSE)

## Notes
This is a personal project and should not be used to encrypt/decrypt critical or important files.
Sekreto CLI may contains unexpected bugs which may damages your files, you are recommended to back up your file before encrypting/decrypting it with Sekreto CLI.
