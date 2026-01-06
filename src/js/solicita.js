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

    if ((resto === 10) || (resto === 11))
        resto = 0;

    if (resto !== parseInt(cpf.substring(9, 10)))
        return false;

    // Se passou por tudo, o CPF é válido
    return true;
}

document.addEventListener('DOMContentLoaded', function() { // Aguarda o documento ser carregado

    // Seleciona elementos do formulario
    const addItemBtn = document.getElementById('add-item-btn');
    const itemList = document.getElementById('item-list');
    const solicitaForm = document.getElementById('solicita-form');

    let itensDaSolicitacao = []; // Armazena os itens em um array

    // Função para renderizar/atualizar a lista visual
    function renderizarLista(){
        itemList.innerHTML = ''; // Limpa a lista vizual atual

        // Recriando cada item na lista com base no array de dados
        itensDaSolicitacao.forEach((item, index) => {
            const listItem = document.createElement('li');

            // Adiciona o texto do item
            const itemText = document.createElement('span');
            itemText.textContent = `${item.nome} - Quantidade: ${item.qtd}`;
            listItem.appendChild(itemText);

            // Cria o Botão de remoção
            const removebtn = document.createElement('button');
            removebtn.textContent = "Remover";
            removebtn.className = 'remove-item-btn';
            // Armazena o índice no próprio botão para saber qual remover
            removebtn.dataset.index = index;
            listItem.appendChild(removebtn);

            itemList.appendChild(listItem);
        });
    }

    // Função para adicionar um novo item ao clique do botão
    addItemBtn.addEventListener('click', function() {
        const tipoItemInput = document.getElementById('tipo_item');
        const quantidadeInput = document.getElementById('quantidade');

       const nomeItem = tipoItemInput.value.trim();
       const quantidade = parseInt(quantidadeInput.value, 10);

       // Validação para não adicionar itens em branco
       if(nomeItem && quantidade > 0){
        itensDaSolicitacao.push({nome: nomeItem, qtd: quantidade});

       //Cria um novo elemento de lista para mostrar o item
       renderizarLista();

       // Limpa os campos de Input 
       //tipoItemInput.value = '';
       quantidadeInput.value = '1';
       tipoItemInput.focus() // Coloca o foco de volta no campo do item
       }
       else{
        alert("Preencha o nome do componente e a quantidade");
       }
    });

    // Função para remover um item ao clique do botão
    itemList.addEventListener('click', function(event) {
        // Verificar se o elemento clicado foi um botão remover
        if(event.target.classList.contains('remove-item-btn')) {
            const indexParaRemover = parseInt(event.target.dataset.index, 10);

            // Removendo o item do array usando o índice
            itensDaSolicitacao.splice(indexParaRemover, 1);

            // Atualiza a lista na tela
            renderizarLista();
        }
    });

    solicitaForm.addEventListener('submit', function(event){
        event.preventDefault() // Previne o comportamento padrão de recarregar a pagina

        const cpfInput = document.getElementById('cpf')
        const cpf = cpfInput.value;
        const descricao = document.getElementById('descricao').value;
        const dataEntregaInput = document.getElementById('data_entrega');
        const dataEntrega = dataEntregaInput.value;
        
        // Validar para não deixar enviar uma solicitação sem itens
        if(itensDaSolicitacao.length === 0){
            alert("Você precisa adicionar pelo menos um item à solicitação");
            return; //Interrompe o envio
        }

        // Validando CPF
        if(!validarCPF(cpf)){
            alert("CPF inválido!");
            cpfInput.focus(); // Coloca o foco de volta no campo CPF
            return;
        }

        // Validação da data de entrega
        const hoje = new Date();
        hoje.setHours(0,0,0,0);

        const [ano, mes, dia] = dataEntrega.split('-').map(Number);
        const dataSelecionada = new Date(ano, mes - 1, dia); // O mês é 0-indexed (0=Janeiro, 11=Dezembro)

        if(dataSelecionada < hoje){
            alert("A data de entrega não pode ser anterior à data de hoje!");
            dataEntregaInput.focus(); // Coloca o foco de volta no campo data de entrega
            return;
        }

        // Montando o objeto final com todos os itens da solicitação
        const dadosSolicitacao = {
            cpf: cpf,
            descricao: descricao,
            dataEntrega: dataEntrega,
            itens: itensDaSolicitacao
        };

        // Exibe os dados no console do navegador (F12) para teste
        console.log("Dados a serem enviados para o servidor:", dadosSolicitacao);
        alert('Solicitação enviada! (Verifique o console do navegador para ver os dados)');
    });
    
    // Banco Simulado
    const bancoComponentes = [
        { 
            id: 1, 
            nome: "CI TL074CN", 
            descricao: "Amp Op Quad JFET", 
            estoque: 12 
        },
        { 
            id: 2, 
            nome: "Arduino Uno R3", 
            descricao: "Microcontrolador ATmega328P", 
            estoque: 15 
        },
        { 
            id: 3, 
            nome: "Resistor 10kΩ", 
            descricao: "Resistor 1/4W", 
            estoque: 500 
        },
        { 
            id: 4, 
            nome: "Multímetro Minipa", 
            descricao: "Instrumentação", 
            estoque: 5 
        }
    ];

    const inputItem = document.getElementById('tipo_item');
    const inputId = document.getElementById('id_tipo_selecionado'); // Input Hidden
    const listaSugestoes = document.getElementById('lista-sugestoes');

    inputItem.addEventListener('input', function() {
        const textoDigitado = this.value.toLowerCase();
        listaSugestoes.innerHTML = ''; 

        if (textoDigitado.length === 0) {
            listaSugestoes.style.display = 'none';
            return;
        }

        const encontrados = bancoComponentes.filter(item => 
            item.nome.toLowerCase().includes(textoDigitado) || 
            item.descricao.toLowerCase().includes(textoDigitado)
        );

        if (encontrados.length > 0) {
            encontrados.forEach(item => {
                const li = document.createElement('li');
                
                // --- LAYOUT SIMPLIFICADO ---
                li.innerHTML = `
                    <span class="nome-item">${item.nome}</span>
                    <div class="meta-item">
                        <span class="categoria-badge">${item.descricao}</span>
                        <span class="estoque-text">Estoque: ${item.estoque}</span>
                    </div>
                `;

                li.addEventListener('click', function() {
                    inputItem.value = item.nome; 
                    
                    // Salva o ID para o Backend
                    if(inputId) inputId.value = item.id; 

                    listaSugestoes.style.display = 'none';
                    
                    const qtdInput = document.getElementById('quantidade');
                    if(qtdInput) qtdInput.focus();
                });

                listaSugestoes.appendChild(li);
            });
            listaSugestoes.style.display = 'block';
        } else {
            listaSugestoes.style.display = 'none';
        }
    });

    // Fecha ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target !== inputItem && e.target !== listaSugestoes) {
            listaSugestoes.style.display = 'none';
        }
    });
});
