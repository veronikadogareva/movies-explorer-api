const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const authLimiter = require('./helpers/rate-limiter');
const router = require('./routes/index');
const error = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_URL, SERVER_PORT } = require('./helpers/config');

const app = express();
// const { PORT = 4000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Подключено к БД');
  const dbConnection = mongoose.connection;

  // Подписываемся на событие ошибки
  dbConnection.on('error', console.error.bind(console, 'Ошибка подключения:'));

  // Подписываемся на событие открытия соединения
  dbConnection.once('open', () => {
    console.log('Соединение открыто');
    // Здесь вы можете выполнять операции с базой данных
  });
})
  .catch((err) => console.error('Ошибка подключения к БД:', err));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(requestLogger);
// app.use(authLimiter);
app.use(router); // подключение маршрутизации
app.use(errorLogger);
app.use(errors()); // подключение валидации
app.use(error);
app.listen(SERVER_PORT, () => {
  console.log(`Сервер запущен. Порт ${SERVER_PORT}`);
});
