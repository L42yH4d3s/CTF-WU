const express = require('express');
const expressWs = require('@wll8/express-ws');
const crypto = require('crypto');

const { doReportHandler } = require('../util/report');
const { encrypt, decrypt } = require('../util/crypto');

let db;
let sessionParser;

const router = express.Router();

router.get('/', (req, res) => {
    return res.render('index.pug');
});

router.get('/signin', (req, res) => {
    return res.render('signin.pug');
});

router.post('/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
    }

    if (result = await db.login(username, password)) {
        req.session.userId = result.id;
        return res.status(200).json({ success: 'User logged in' });
    } else {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
});

router.get('/register', (req, res) => {
    return res.render('register.pug');
});

router.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            error: 'Missing username or password'
        });
    }

    if (await db.userExists(username)) {
        return res.status(400).json({ error: 'User already exists' });
    } 

    const key = crypto.randomBytes(16).toString('hex');
    await db.register(username, password, key);

    return res.status(200).json({ success: 'User registered' });
});

router.get('/key', async (req, res) => {
    const result = await db.getkey(req.session.userId);
    if (result) {
        return res.status(200).json({ key: result });
    }
    return res.status(400).json({ error: 'No key found' });
});

router.post('/decrypt', async (req, res) => {
    if (!req.body.key) {
        return res.status(400).json({ error: 'Missing key' });
    }

    if (!req.body.cipher) {
        return res.status(400).json({ error: 'Missing cipher' });
    }

    try {
        const result = decrypt(req.body.cipher, req.body.key);
        return res.status(200).json({ decrypted: result });
    } catch (e) {
        return res.status(400).json({ error: 'Invalid key or cipher' });
    }
});

// Report any suspicious activity to the admin!
router.post('/report', doReportHandler);

module.exports = (database, session) => {
    db = database;
    sessionParser = session;
    return router;
};