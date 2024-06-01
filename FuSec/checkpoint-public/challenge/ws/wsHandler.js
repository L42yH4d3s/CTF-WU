const { encrypt, decrypt } = require('./util/crypto');

let db;
let sessionParser;

const quotes = [
    "The only way to do great work is to love what you do.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it."
];


const websockerHandler = (ws, req) => {
    let uid;

    sessionParser(req, {}, () => {
        if (req.session.userId) {
            uid = req.session.userId;
        } else {
            ws.close();
        }
    });

    ws.on('message', async (msg) => {
        const data = JSON.parse(msg);
        const key = await db.getkey(req.session.userId);

        if (data.action === 'add') {
            try {
                const task = `{"title":"${data.title}","description":"${data.description}","skey":"${key}"}`;
                if (task.length > 255) {
                    console.log(`Data too long: ${data.description}`);
                    throw new Error('Data too long');
                }
                await db.addTask(uid, task);
                ws.send(JSON.stringify({ success: true, action: 'add' }));
            } catch (e) {
                console.log(`Error adding task: ${e}`);
                ws.send(JSON.stringify({ success: false, action: 'add', error: e }));
            }
        }
        else if (data.action === 'get') {
            try {
                const results = await db.getTasks(uid);
                const tasks = [];
                for (const result of results) {

                    let quote;

                    if (uid === 1) {
                        quote = `${process.env.FLAG}`;
                    } else {
                        quote = quotes[Math.floor(Math.random() * quotes.length)];
                    }

                    try {
                        const task = JSON.parse(result.data);
                        tasks.push({
                            title: encrypt(task.title, task.skey),
                            description: encrypt(task.description, task.skey),
                            quote: encrypt(quote, task.skey)
                        });
                    } catch (e) {
                        console.log(`Error parsing task ${result.data}: ${e}`);
                    }
                }
                ws.send(JSON.stringify({ success: true, action: 'get', tasks: tasks }));
            } catch (e) {
                ws.send(JSON.stringify({ success: false, action: 'get' }));
            }
        }
        else {
            ws.send(JSON.stringify({ success: false, error: 'Invalid action' }));
        }
    });
};

module.exports = (database, session) => {
    db = database;
    sessionParser = session;
    return websockerHandler;
};