document.addEventListener('DOMContentLoaded',function() {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        //1. Coleta de dados dos campos
        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;
        //2. Montagem do objeto para envio
        const dadosLogin = {
            login: login,
            senha: senha
        };
    });
});