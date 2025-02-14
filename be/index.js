require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var morgan = require('morgan')
const quote = require('./routes/quotes');
const author = require('./routes/author');
var cors = require('cors')
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');


app.use(morgan('dev'))

/* TODO: Replace for FE application URL with 'http://localhost:3001' if you get CORS error */
var corsOptions = {
    origin: ['http://localhost:4200', 'http://localhost:3000', 'http://localhost:8080', '*']
}
app.use(cors())

// mongoose.connect('mongodb://root:rootpassword@localhost:27017/?authSource=admin',
//     {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false
//     })
//     .then(() => console.log('*********  Connected to MongoDb **********'))
//     .catch(error => console.log('--------- Could not connect to MongoDb -------', error));


mongoose.connect(process.env.MONGODB_URI,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('*********  Connected to MongoDb **********'))
    .catch(error => console.log('--------- Could not connect to MongoDb -------', error));

app.use(express.json());

const deployedDate = '2021-Jun-05'

// Add before other routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

/* Set Routes */
app.use('/quote', quote);
app.use('/author', author);
app.use('/', (_, res) => {
    res.send(`Welcome to Quotes   API (v1) -- Deployed Date : ${deployedDate}`);
});


const port = process.env.PORT || 9090;

app.listen(port, () => console.log(`Application started at Port ==> ${port}`));