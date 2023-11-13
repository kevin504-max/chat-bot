const env = require('../.env')
const Telegraf = require('telegraf');
const { Message } = require('../models/Message');

const readline = require('readline');

const bot = new Telegraf(env.botToken);

const USER = -1;
const ROBOT = 1;

const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports = class HashGameService {
    evaluation = async (state) => {
        if (await this.victory(state, ROBOT)) {
            return 1;
        } else if (await this.victory(state, USER)) {
            return -1;
        } else {
            return 0;
        }
    }

    victory = async (state, player) => {
        const winStates = [
            [state[0][0], state[0][1], state[0][2]],
            [state[1][0], state[1][1], state[1][2]],
            [state[2][0], state[2][1], state[2][2]],
            [state[0][0], state[1][0], state[2][0]],
            [state[0][1], state[1][1], state[2][1]],
            [state[0][2], state[1][2], state[2][2]],
            [state[0][0], state[1][1], state[2][2]],
            [state[2][0], state[1][1], state[0][2]]
        ];

        return winStates.some((line) => line.every((cell) => cell === player));
    }

    endGame = async (state) => {
        return await this.victory(state, USER) || await this.victory(state, ROBOT);
    }

    voidCells = async (state) => {
        const cells = [];

        for (let i = 0; i < state.length; i++) {
            for (let j = 0; j < state[i].length; j++) {
                if (state[i][j] === 0) {
                    cells.push([i, j]);
                }
            }
        }

        return cells;
    }

    validMoviment = async (line, column) => {
        const cells = await this.voidCells(board);

        return cells.some((cell) => cell[0] === line && cell[1] === column);
    }

    makeMoviment = async (line, column, player) => {
        if (await this.validMoviment(line, column)) {
            board[line][column] = player;

            return true;
        } 
        
        return false; 
    }
    miniMax = async (state, depth, player) => {
        if (player === ROBOT) {
            var melhor = [-1, -1, -Infinity];
        } else {
            var melhor = [-1, -1, +Infinity];
        }
    
        if (depth === 0 || await this.endGame(state)) {
            var score = await this.evaluation(state);
            return [-1, -1, score];
        }
    
        for (var i = 0; i < state.length; i++) {
            for (var j = 0; j < state[i].length; j++) {
                if (state[i][j] === 0) {
                    state[i][j] = player;
                    var score = await this.miniMax(state, depth - 1, -player);
                    state[i][j] = 0;
                    score[0] = i;
                    score[1] = j;
    
                    if (player === ROBOT) {
                        if (score[2] > melhor[2]) {
                            melhor = score;  // valor MAX
                        }
                    } else {
                        if (score[2] < melhor[2]) {
                            melhor = score;  // valor MIN
                        }
                    }
                }
            }
        }
    
        return melhor;
    }

    cleanConsole = async () => {
        console.clear();
    }

    showBoard = async (state, robotChoice, userChoice, chatId, username) => {
        let message = '';

        for (let i = 0; i < state.length; i++) {
            let row = '\n-----------------------------\n';

            for (let j = 0; j < state[i].length; j++) {
                if (state[i][j] === ROBOT) {
                    row += `| ${robotChoice} |`;
                } else if (state[i][j] === USER) {
                    row += `| ${userChoice} |`;
                } else {
                    row += '|   |';
                }
            }
            
            message += row;
        }
        
        message += '\n-----------------------------';

        bot.telegram.sendMessage(chatId, message);
        await this.saveBotMessage(message, username, chatId);
    }

    IATurn = async (robotChoice, userChoice, chatId, username) => {
        const depth = await this.voidCells(board);
        const depthLength = Object.keys(depth).length;

        if (await this.endGame(board)) {
            const message = 'Game Over!';

            bot.telegram.sendMessage(chatId, message);
            await this.saveBotMessage(message, username, chatId);
            return;
        } else if (depthLength === 0) {
            const message = 'We Draw!';

            bot.telegram.sendMessage(chatId, message);
            await this.saveBotMessage(message, username, chatId);
            return;
        }
        
        if (depthLength === 9) {
            const line = Math.floor(Math.random() * 3);
            const column = Math.floor(Math.random() * 3);

            await this.makeMoviment(line, column, ROBOT);
        } else {
            const move = await this.miniMax(board, depthLength, ROBOT);
            const line = move[0];
            const column = move[1];

            await this.makeMoviment(line, column, ROBOT);
        }

        await this.showBoard(board, robotChoice, userChoice, chatId, username);
        
        const message = `Your turn [${userChoice}]\nUse number (1-9): `;
        
        bot.telegram.sendMessage(chatId, message);
        await this.saveBotMessage(message, username, chatId);
    }

    UserTurn = async (robotChoice, userChoice, chatId, input, username) => {
        const depth = await this.voidCells(board);
        const depthLength = Object.keys(depth).length;

        if (await this.endGame(board)) {
            const message = 'Game Over!';

            bot.telegram.sendMessage(chatId, message);
            await this.saveBotMessage(message, username, chatId);
            return;
        } else if (depthLength === 0) {
            const message = 'We Draw!';

            bot.telegram.sendMessage(chatId, message);
            await this.saveBotMessage(message, username, chatId);
            return;
        }

        if (input) {
            const moviment = parseInt(input);
            const moviments = {
                1: [0, 0], 2: [0, 1], 3: [0, 2],
                4: [1, 0], 5: [1, 1], 6: [1, 2],
                7: [2, 0], 8: [2, 1], 9: [2, 2]
            };
    
            if (moviments[moviment]) {
                const coordenate = moviments[moviment];
                const tryMoviment = this.makeMoviment(coordenate[0], coordenate[1], USER);
         
                if (!tryMoviment) {
                    const message = 'Invalid Moviment!';
                    
                    bot.telegram.sendMessage(chatId, message);
                    await this.saveBotMessage(message, username, chatId);
                    this.UserTurn(robotChoice, userChoice, chatId);
                }

                const message = `My turn [${robotChoice}]`;

                await this.showBoard(board, robotChoice, userChoice, chatId, username);
                bot.telegram.sendMessage(chatId, message);
                await this.saveBotMessage(message, username, chatId);
                await this.IATurn(robotChoice, userChoice, chatId, username);
            }
        }
    }

    gameLoop = async (robotChoice, userChoice, first, chatId, username) => {
        if (first === 'N') {
            await this.IATurn(robotChoice, userChoice, chatId, username);
            first = '';
        } else {
            const message = `Your turn [${userChoice}]\nUse number (1-9): `;

            bot.telegram.sendMessage(chatId, message);
            await this.saveBotMessage(message, username, chatId);

            await this.showBoard(board, robotChoice, userChoice, chatId, username);
            await this.UserTurn(robotChoice, userChoice, chatId);
        }

    }

    saveBotMessage = async (message, sendTo, chatId) => {
        try {
            const botMessage = new Message({
                username: 'Bot',
                message: message,
                date: new Date(),
                sendTo: sendTo,
                chatId: chatId
            });

            await botMessage.save();
        } catch (error) {
            console.error('BotService::saveBotMessages ', error);
            throw `Error ${error}`;
        }
    }
}