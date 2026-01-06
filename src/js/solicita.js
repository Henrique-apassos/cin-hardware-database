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

    const modalConfirmacao = document.getElementById('modal-confirmacao');
    const btnConfirmarEnvio = document.getElementById('btn-confirmar-envio');
    const btnCancelarEnvio = document.getElementById('btn-cancelar-envio');

    let itensDaSolicitacao = []; // Armazena os itens em um array
    let dadosProntosParaEnvio = null;

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

    // Busca de componentes
    const inputsItem = [
        document.getElementById('tipo_item'),
        document.getElementById('quantidade')
    ];

    const inputItem = document.getElementById('tipo_item');
    const inputId = document.getElementById('id_tipo_selecionado'); // Input Hidden
    const listaSugestoes = document.getElementById('lista-sugestoes');

    let currentFocus = -1 // Variável que diz qual item está selecionado (-1 = nenhum)

    inputItem.addEventListener('input', function() {
        const textoDigitado = this.value.toLowerCase();
        listaSugestoes.innerHTML = '';
        currentFocus = -1;

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
                   selecionarItem(item)
                });

                listaSugestoes.appendChild(li);
            });
            listaSugestoes.style.display = 'block';
        }
        else {
            listaSugestoes.style.display = 'none';
        }
    });

    // Função auxiliar de adicioar um item
    function selecionarItem(item) {
        inputItem.value = item.nome;

        // Salva o ID para o Backend
        if (inputId) inputId.value = item.id;

        listaSugestoes.style.display = 'none';
        listaSugestoes.innerHTML = '';

        setTimeout(function(){
            const qtdInput = document.getElementById('quantidade');
            if(qtdInput){
                qtdInput.focus();
                qtdInput.select();
            }
        }, 10);
    }

    // Controle por teclado
    inputItem.addEventListener('keydown', function(e) {
        let itensVisiveis = listaSugestoes.getElementsByTagName('li');
        
        if (listaSugestoes.style.display === 'none' || itensVisiveis.length === 0) {
            return; 
        }

        if (e.key === 'ArrowDown') { // Seta Baixo
            e.preventDefault(); 
            
            currentFocus++;
            addActive(itensVisiveis);
        } 
        else if (e.key === 'ArrowUp') { // Seta Cima
            e.preventDefault();

            currentFocus--;
            addActive(itensVisiveis);
        } 
        else if (e.key === 'Enter') {
            // Se o Enter for apertado e tiver item focado
            if (currentFocus > -1) {
                e.preventDefault(); 
                
                if (itensVisiveis && itensVisiveis[currentFocus]) {
                    itensVisiveis[currentFocus].click(); // Simula o clique no item colorido
                }
            }
        }
        else if (e.key === 'Escape') {
            listaSugestoes.style.display = 'none';
            currentFocus = -1;
        }
    });

    // Função de printar o item ativo
    function addActive(x) {
        if (!x) return false;
        
        removeActive(x); // Primeiro limpa todos
        
        if (currentFocus >= x.length) currentFocus = 0; // Se passar do fim, volta pro topo
        if (currentFocus < 0) currentFocus = (x.length - 1); // Se passar do topo, vai pro fim
        
        // Adiciona a classe visual '.active'
        x[currentFocus].classList.add("active");
        
        // Garante que o scroll da lista acompanhe o item selecionado
        x[currentFocus].scrollIntoView({ block: 'nearest' });
    }

    // 2. Remove a pintura de todos os itens
    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("active");
        }
    }

    // Fecha ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target !== inputItem && e.target !== listaSugestoes) {
            listaSugestoes.style.display = 'none';
        }
    });

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
        const idInput = document.getElementById('id_tipo_selecionado');

        const idItem = idInput.value ? parseInt(idInput.value, 10) : null;
        const nomeItem = tipoItemInput.value.trim();
        const quantidade = parseInt(quantidadeInput.value, 10);

       // Validação para não adicionar itens em branco
        if(nomeItem && quantidade > 0){
            
            // 1. Busca o item no Banco Oficial
            let itemOriginal = bancoComponentes.find(i => i.id === idItem);
            
            if (!itemOriginal) {
                itemOriginal = bancoComponentes.find(i => i.nome.toLowerCase() === nomeItem.toLowerCase());
            }

            if (itemOriginal) {
                // 2. Verifica se o item JÁ EXISTE na lista de solicitação
                const indexExistente = itensDaSolicitacao.findIndex(i => i.id === itemOriginal.id);
                
                // Calcula quanto já temos desse item no carrinho
                let qtdAtualNoCarrinho = 0;
                if (indexExistente !== -1) {
                    qtdAtualNoCarrinho = itensDaSolicitacao[indexExistente].qtd;
                }

                // 3. Verificação de Estoque (Soma o que já tem + o novo pedido)
                const totalDesejado = qtdAtualNoCarrinho + quantidade;

                if (totalDesejado > itemOriginal.estoque) {
                    let msg = `Estoque insuficiente para "${itemOriginal.nome}"!\n`;
                    msg += `\n Estoque Total: ${itemOriginal.estoque}`;
                    msg += `\n Já no seu carrinho: ${qtdAtualNoCarrinho}`;
                    msg += `\n Tentativa atual: ${quantidade}`;
                    msg += `\n Total ficaria: ${totalDesejado}`;
                    
                    alert(msg);
                    
                    quantidadeInput.focus();
                    quantidadeInput.select();
                    return; 
                }

                // --- 4. A MÁGICA DO MERGE ---
                if (indexExistente !== -1) {
                    // CENÁRIO A: Item já existe -> Apenas atualiza a quantidade
                    itensDaSolicitacao[indexExistente].qtd += quantidade;
                    console.log(`Atualizado: ${itemOriginal.nome} agora tem ${itensDaSolicitacao[indexExistente].qtd}`);
                } else {
                    // CENÁRIO B: Item novo -> Cria nova linha
                    // Atualiza o ID caso tenha achado pelo nome
                    if(!idItem && idInput) idInput.value = itemOriginal.id;

                    itensDaSolicitacao.push({
                        id: itemOriginal.id,
                        nome: itemOriginal.nome, 
                        qtd: quantidade
                    });
                }

            } else {
                alert("Erro: Item não identificado no catálogo oficial.");
                return;
            }

            // Atualiza a tela
            renderizarLista();

            // Limpeza
            tipoItemInput.value = '';
            quantidadeInput.value = '1';
            if(idInput) idInput.value = ''; 
            tipoItemInput.focus();

        } else {
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

    // Enter para adicionar item
    const inputQtd = document.getElementById('quantidade');
    if(inputQtd) {
        inputQtd.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                addItemBtn.click(); // Adiciona à lista
            }
        });
    }
    inputItem.addEventListener('keydown', function(event) {
       if (event.key === 'Enter') {
           // Se a lista estiver fechada ou vazia, o Enter serve como "TAB" (vai pro próximo campo)
           if(listaSugestoes.style.display === 'none' || listaSugestoes.innerHTML === '') {
               event.preventDefault();
               const qtdInput = document.getElementById('quantidade');
               if(qtdInput) {
                   qtdInput.focus();
                   qtdInput.select();
               }
           }
       } 
    });

    // Lógica de Submição
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

        // Confirmação de dados
        dadosProntosParaEnvio = {
            cpf: cpf,
            descricao: descricao,
            dataEntrega: dataEntrega,
            itens: itensDaSolicitacao
        };

        if(document.getElementById('conf-cpf'))
            document.getElementById('conf-cpf').textContent = cpf;
        
        if(document.getElementById('conf-data'))
            document.getElementById('conf-data').textContent = dataEntrega.split('-').reverse().join('/');

        const listaResumo = document.getElementById('conf-lista-itens');
        if(listaResumo){
            listaResumo.innerHTML = '';
            itensDaSolicitacao.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.qtd}x - ${item.nome}`;
                listaResumo.appendChild(li);
            });
        }

        if(modalConfirmacao){
            modalConfirmacao.style.display = 'flex';
        }
        else{
            console.error("ERRO: Modal não encontrado no HTML. Verifique se copiou o código HTML do modal.");
            // Fallback: Se não achar o modal, pergunta no alert mesmo
            if(confirm("Confirma o envio?")) {
                btnConfirmarEnvio.click(); // Simula clique
            }
        }
    });

    // Ações da janela de confirmação

    // Botão voltar (Fechar janela)
    if(btnCancelarEnvio){
        btnCancelarEnvio.addEventListener('click', function(){
            modalConfirmacao.style.display = 'none';
        });
    }

    // Botão Confirmar (Envia Realmente)
    if(btnConfirmarEnvio){
        btnConfirmarEnvio.addEventListener('click', function(){
            console.log("ENVIO FINAL: ", dadosProntosParaEnvio);

            // Aqui vai entrar o fetch() para Python

            alert('Sucesso! Solicitação enviada.');
            modalConfirmacao.style.display = 'none';

            // Reseta tudo
            itensDaSolicitacao = [];
            renderizarLista();
            solicitaForm.reset();
        });
    }
});