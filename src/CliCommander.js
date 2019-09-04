'use strict';

const { EventEmitter } = require('events');
const readline         = require('readline');

class CliCommander extends EventEmitter {
    constructor() {
        super();

        this._tmpCommands = [];

        this._rl = readline.createInterface({
            input:     process.stdin,
            output:    process.stdout,
            completer: this._completer.bind(this),
        });

        this._rl.on('line', this._onRunLine.bind(this));
    }

    /**
     * @param {string} message
     * @param {string[]} [hits]
     * @param {*} [value]
     * @return {Promise<*>}
     */
    prompt(message, hits, value) {
        if (hits) {
            this._tmpCommands = hits.map(String);
        }

        if (value) {
            this._rl.write(JSON.stringify(value));
        }

        return new Promise(resolve => {
            this._rl.question(message, answer => {
                this._tmpCommands = [];

                try {
                    resolve(JSON.parse(answer));
                } catch (e) {
                    resolve(answer);
                }
            });
        });
    }

    /**
     * @param {string} message
     */
    write(message) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        console.log(message);
        this._rl.prompt(true);
    }

    /**
     * @return {string[]}
     * @private
     */
    _getCommands() {
        return this._tmpCommands.length ? this._tmpCommands : this.eventNames();
    }

    /**
     * @param {string} line
     * @return {string[]}
     * @private
     */
    _completer(line) {
        const commands = this._getCommands();
        const hits     = commands.filter(commandName => commandName.startsWith(line));

        return [hits.length ? hits : commands, line];
    }

    /**
     * @param {string} line
     * @private
     */
    _onRunLine(line) {
        const command = (line || '').toString().trim();

        if (!command) {
            return;
        }

        const commands = this._getCommands();

        if (commands.includes(command)) {
            this.emit(command);
        }
    }
}

module.exports = CliCommander;
