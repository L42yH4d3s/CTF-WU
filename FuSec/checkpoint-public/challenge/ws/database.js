const util = require('util');
const mysql = require('mysql');

// write log about exec command to file .log
const fs = require('fs');
const { exec } = require('child_process');


class Database {
    constructor(user, password, database) {
        this.db = mysql.createConnection({
            host: 'localhost',
            user: user,
            password: password,
            database: database,
            stringifyObjects: true
        });
        this.query = util.promisify(this.db.query).bind(this.db);
    }

    connect() {
        this.db.connect();
    }

    async userExists(username) {
        const res = await this.query('SELECT * FROM users WHERE username = ?', [username]);
        return res.length === 1;
    }

    async register(username, password, key) {
        const res = await this.query('INSERT INTO users (username, password, skey) VALUES (?, ?, ?)', [username, password, key]);
        return res;
    }

    async login(username, password) {
        const res = await this.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (res.length === 1) {
            exec(`echo "User ${username} logged in" >> /var/log/wscorn.log`);
            return res[0];
        }

        return false;
    }

    async addTask(userId, data) {
        const res = await this.query('INSERT INTO todos (user_id, data) VALUES (?, ?)', [userId, data]);
        exec(`echo "User ${userId} added a todo with ${data}" >> /var/log/wscorn.log`);
        return res;
    }

    async getTasks(userId) {
        const res = await this.query('SELECT * FROM todos WHERE user_id = ?', [userId]);
        return res;
    }

    async getkey(userId) {
        const res = await this.query('SELECT skey FROM users WHERE id = ?', [userId]);
        return res.length === 1 ? res[0].skey : false;
    }
}

module.exports = Database;