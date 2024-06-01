const formHandler = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (res.status === 200) {
        Swal.fire({
            title: 'Success!',
            text: 'You have been logged in!',
            icon: 'success'
        });
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        return;
    }

    const data = await res.json();
    Swal.fire({
        title: 'Oops...',
        text: data.error,
        icon: 'error'
    });

}

document.getElementById('submit').addEventListener('click', (e) => {
    try { formHandler() } catch {}
});