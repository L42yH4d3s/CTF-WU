const checkLists = document.getElementById('tasks');
const form = document.getElementById('checkList-form');

const ws = new WebSocket(`ws://${window.location.host}/ws`);

const showCheckLists = (checkList) => {
    const element = document.createElement('div');
    element.classList.add('task');
    element.appendChild(document.createElement('h3')).appendChild(document.createElement('checkbox')).innerText = checkList.title.content;
    element.appendChild(document.createElement('p')).innerText = checkList.description.content;
    element.appendChild(document.createElement('p')).appendChild(document.createElement('i')).innerText = checkList.quote.content;
    checkLists.appendChild(element);
};

const decrypt = async (cipher, key) => {
    const res = await fetch('/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cipher, key })
    });

    const json = await res.json();
    return json.decrypted;
}

ws.onopen = () => {
    ws.send(JSON.stringify({ action: 'get' }));
}

ws.onmessage = async (msg) => {
    const data = JSON.parse(msg.data);
    if (data.success) {
        if (data.action === 'get') {
            const key = await fetch('/key').then(res => res.json()).then(data => data.key);
            for (const task of data.tasks) {
                showCheckLists({
                    title: {
                        iv: task.title.iv,
                        content: await decrypt(task.title, key)
                    },
                    description: {
                        iv: task.description.iv,
                        content: await decrypt(task.description, key)
                    },
                    quote: {
                        iv: task.quote.iv,
                        content: await decrypt(task.quote, key)
                    }
                });
            }
        }
        else if (data.action === 'add') {
            form.reset();
        }
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.error
        });
    }
}

const formHandler = async () => {
    const title = form.querySelector('#title').value;
    const description = form.querySelector('#description').value;

    ws.send(JSON.stringify({ action: 'add', title, description }));
    
    checkLists.innerHTML = '';
    ws.send(JSON.stringify({ action: 'get' }));

    Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Task added!'
    });
}

form.querySelector('button').addEventListener('click', (e) => {
    try { formHandler() } catch { }
});