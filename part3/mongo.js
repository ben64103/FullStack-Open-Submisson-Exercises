require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { requestLogger, errorHandler } = require('./utils/middleware/requestLogger');
const { info } = require('./utils/logger');
const { PORT } = require('./utils/config');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(requestLogger);
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.use('/', require('./controllers/persons'));

app.use(errorHandler);

app.listen(PORT, () => {
  info(`Server running on port ${PORT}`);
});
