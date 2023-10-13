const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '6618877932:AAHy2Cv4YT72CEm-1iWC5VbaG1AZX8tYMmw';
const bot = new TelegramApi(token, { polling: true });
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, 'Я загадаю цифру от 0 до 9, тебе нужно отгадать!');
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадывай, я загадал!', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Приветствие!' },
    { command: '/info', description: 'Информация о пользователе!' },
    { command: '/game', description: 'Угадай число' },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/1.jpg',
      );
      return bot.sendMessage(chatId, `Привет, это тестовый бот, создан для тренировки!)`);
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}!`);
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Шо ты пишешь не понятно');
  });

  bot.on('callback_query', (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(chatId, 'Ты угадал)))', againOptions);
    } else {
      return bot.sendMessage(
        chatId,
        `Ты проиграл, бот загадал цифру ${chats[chatId]}`,
        againOptions,
      );
    }
  });
};
start();
