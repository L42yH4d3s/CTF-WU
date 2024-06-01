const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressWs = require('@wll8/express-ws')

const routes = require('./routes');
const websockerHandler = require('./wsHandler');
const Database = require('./database');
const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const antiCSRFMiddleware = require('./middleware/antiCSRFMiddleware');

const db = new Database(process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, 'wscorn');
db.connect();

const { app, } = expressWs(express());

const preParse = session({
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true
})

app.use(preParse);
app.use(bodyParser.json());
app.use('/static', express.static('static'));
app.set('view engine', 'pug');
app.use(authenticationMiddleware);
app.use(antiCSRFMiddleware);
app.use(routes(db, preParse));
app.ws('/ws', websockerHandler(db, preParse));
app.all('*', (req, res) => {
    return res.status(404).send({
        message: '404 page not found'
    });
});
app.listen(80, () => console.log('Listening on port 80'));