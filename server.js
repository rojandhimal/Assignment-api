require('dotenv').config({ debug: true })

const app = require('./src/app');

const PORT = process.env.PORT || 5001;
const server = require('http').createServer(app);

server.listen(PORT, () => console.log(`Server started on PORT: ${PORT} in ${process.env.NODE_ENV} mode`));