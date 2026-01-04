// Simulação dos dados do backend
const mockSolicitacoes = [
    {
        id: 1020,
        data_solicitacao: '2025-12-28',
        data_entrega: '2025-12-29',
        status: 'Ativo',
        itens: [
            { nome: 'Arduino Uno', qtd: 2 },
            { nome: 'Protoboard', qtd: 1 },
            { nome: 'kit resistores', qtd: 1},
            { nome: 'Arduino Nano', qtd: 2},
            { nome: 'Sensor Ultrasom', qtd: 1},
            { nome: 'Multímetro', qtd: 1}
        ]
    },
    {
        id: 1021,
        data_solicitacao: '2026-01-02',
        data_entrega: '2026-01-10',
        status: 'Pendente',
        itens: [
            { nome: 'Osciloscópio Minipa', qtd: 1 }
        ]
    },
    {
        id: 1015,
        data_solicitacao: '2025-11-10',
        data_entrega: '2025-11-15',
        status: 'Finalizado', // Já devolvido
        itens: [
            { nome: 'Kit Resistores', qtd: 1 }
        ]
    }
];

// Funções para a janela de detalhes

function abrirModal(id) {
    // Acha o pedido correto pelo ID
    const pedido = mockSolicitacoes.find(sol => sol.id === id);

    if (pedido) {
        // Preenche os dados no HTML do Modal
        document.getElementById('m-id').textContent = pedido.id;
        document.getElementById('m-data-sol').textContent = formatarData(pedido.data_solicitacao);
        document.getElementById('m-data-ent').textContent = formatarData(pedido.data_entrega);
        
        // Status com cor
        const spanStatus = document.getElementById('m-status');
        spanStatus.textContent = pedido.status;
        spanStatus.className = 'badges'; // Reseta as classes
        
        // Reaproveita a lógica de cores
        const hoje = new Date().toISOString().split('T')[0];
        if (pedido.status === 'Pendente') spanStatus.classList.add('badge-pendente');
        else if (pedido.status === 'Ativo' && pedido.data_entrega < hoje) {
             spanStatus.textContent = 'Atrasado';
             spanStatus.classList.add('badge-atrasado');
        }
        else if (pedido.status === 'Ativo') spanStatus.classList.add('badge-ativo');
        else spanStatus.classList.add('badge-finalizado');

        // Lista de Itens
        const lista = document.getElementById('m-lista-itens');
        lista.innerHTML = ''; // Limpa lista anterior
        pedido.itens.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.qtd}x - ${item.nome}`;
            lista.appendChild(li);
        });

        // Mostra o Modal (Muda o display para flex)
        document.getElementById('modal-detalhes').style.display = 'flex';
    }
}

function fecharModal() {
    document.getElementById('modal-detalhes').style.display = 'none';
}

// Fechar se clicar fora da caixa branca
window.onclick = function(event) {
    const modal = document.getElementById('modal-detalhes');
    if (event.target == modal) {
        fecharModal();
    }
}

// Função para formatar data (YYYY-MM-DD para DD/MM/YYYY)
function formatarData(dataISO) {
    if (!dataISO) return '-';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}

document.addEventListener('DOMContentLoaded', function(){

    // --- CORREÇÃO DO BOTÃO FECHAR ---
    const modal = document.getElementById('modal-detalhes');
    const btnFechar = document.querySelector('.close-btn');

    // 1. Função para fechar (agora interna e segura)
    function fecharModal() {
        modal.style.display = 'none';
    }

    // 2. Adiciona o evento de clique no X
    if(btnFechar) {
        btnFechar.addEventListener('click', fecharModal);
    }

    // 3. Adiciona o evento de clicar fora para fechar (Opcional, mas útil)
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            fecharModal();
        }
    });

    // Função para renderizar tabela
    function renderizarTabela(dados){
        const tbody = document.getElementById('lista-corpo');
        const countAtivos = document.getElementById('count-ativos');
        const countPendentes = document.getElementById('count-pendentes');
        const countAtrasados = document.getElementById('count-atrasados'); // Faltava capturar este elemento

        let totalAtivos = 0;
        let totalPendentes = 0;
        let totalAtrasados = 0; // Nova variável para contagem

        tbody.innerHTML = ''; 

        dados.forEach(sol => {
            // Lógica de Data (Verifica se está atrasado)
            const hoje = new Date().toISOString().split('T')[0];
            let statusFinal = sol.status;
            let classeBadge = '';

            if(sol.status === 'Ativo' && sol.data_entrega < hoje){
                statusFinal = 'Atrasado';
            }

            // Contagem (Baseada no status JÁ atualizado)
            if(statusFinal === 'Ativo') totalAtivos++;
            else if(statusFinal === 'Pendente') totalPendentes++;
            else if(statusFinal === 'Atrasado') totalAtrasados++;

            // Definição de Cores (CSS)
            if(statusFinal === 'Pendente') classeBadge = 'badge-pendente';
            else if(statusFinal === 'Ativo') classeBadge = 'badge-ativo';
            else if(statusFinal === 'Atrasado') classeBadge = 'badge-atrasado';
            else classeBadge = 'badge-finalizado';

            // Renderização HTML
            const resumoItens = sol.itens.map(i => `${i.nome} (${i.qtd})`).join(', ');
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${sol.id}</td>
               <td>${formatarData(sol.data_solicitacao)}</td>
               <td>
                   <div class="texto-limitado" title="${resumoItens}">
                       ${resumoItens}
                   </div>
               </td>
               <td>${formatarData(sol.data_entrega)}</td>
                <td><span class="badges ${classeBadge}">${statusFinal}</span></td>
               <td>
                    <button class="bnt-detalhes" onclick="abrirModal(${sol.id})">Detalhes</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Atualiza os cards no HTML
        if(countAtivos) countAtivos.textContent = totalAtivos;

        if(countPendentes) {
            countPendentes.textContent = totalPendentes;
            
            // Pega a DIV pai (o card)
            const cardPendente = countPendentes.parentElement;

            if (totalPendentes > 0) {
                // Se tiver pendência, fica AMARELO
                cardPendente.classList.add('attention');
            } else {
                // Se não, volta ao verde original
                cardPendente.classList.remove('attention');
            }
        }

        if(countAtrasados) {
            countAtrasados.textContent = totalAtrasados;
            // Pega a DIV pai do número (a <div class="card-status">)
            const cardContainer = countAtrasados.parentElement;

            if (totalAtrasados > 0) {
                // Se tiver atraso, ADICIONA a classe que deixa a borda vermelha
                cardContainer.classList.add('warning');
            } else {
                // Se não tiver, REMOVE a classe (volta a ser verde)
                cardContainer.classList.remove('warning');
            }
        }
    }

    // Inicializa
    renderizarTabela(mockSolicitacoes);
});