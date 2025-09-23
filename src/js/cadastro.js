// Função para verificar CPF
function validarCPF(cpf) {
    // 1. Remove pontos e traços
    cpf = String(cpf).replace(/[^\d]+/g, '');

    // 2. Verifica se tem 11 dígitos
    if (cpf.length !== 11)
        return false;

    // 3.Verifica se todos os dígitos não são iguais (ex: 111.111.111-11)
    if (/^(\d)\1+$/.test(cpf))
        return false;

    // 4. Validação dos dígitos verificadores
    let soma = 0;
    let resto;
    // --- Cálculo do 1o dígito verificador ---
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11))
        resto = 0;

    if (resto !== parseInt(cpf.substring(9, 10)))
        return false;

    // --- Cálculo do 2o dígito verificador ---
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    // >> CORREÇÃO 1: A linha abaixo estava faltando para calcular o resto do 2º dígito <<
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11))
        resto = 0;

    // >> CORREÇÃO 2: A comparação estava sendo feita com o dígito errado (9, 10) em vez de (10, 11) <<
    if (resto !== parseInt(cpf.substring(10, 11)))
        return false;

    // Se passou por tudo, o CPF é válido
    return true;
}

document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('cadastro-form');

    form.addEventListener('submit', function(event){
        event.preventDefault();

        //1. Coleta de dados dos campos 
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const email = document.getElementById('email').value;
        const matricula = document.getElementById('matricula').value;
        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;
        const confirmaSenha = document.getElementById('confirma-senha').value;

        //2. Validações
        if(senha !== confirmaSenha){
            alert("As senhas não coincidem. Por Favor, tente novamente.");
            return;
        }

        if(senha.length < 8){
            alert("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        if(!validarCPF(cpf)){
            alert("O CPF inserido é inválido.");
            return;
        }

        //3. Montagem do objeto de dados para o envio 
        const dadosCadastro = {
            nome: nome,
            cpf: cpf.replace(/[^\d]+/g,''), // Envia somente os números do CPF
            email: email,
            matricula: matricula,
            login: login,
            senha: senha
        }

        // Simulação de envio
        console.log('Dados prontos para serem enviados ao backend:', dadosCadastro);
        alert('Cadastro realizado com sucesso! (Simulação)');
    });
});