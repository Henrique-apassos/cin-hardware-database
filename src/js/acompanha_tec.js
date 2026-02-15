/* --- DADOS SIMULADOS --- */
let solicitacoes = [
    { 
        id: 1021, aluno: "João Silva", login: "js2", data: "2026-02-09", 
        finalidade: "Projeto de Graduação (TCC)",
        itens: [{ nome: "Arduino Uno", qtd: 2 }, { nome: "Sensor Ultrassônico", qtd: 1 }], 
        status: "Pendente" 
    },
    { 
        id: 1024, aluno: "Maria Oliveira", login: "mo5", data: "2026-02-05", 
        finalidade: "Aula de Infraestrutura",
        itens: [{ nome: "Raspberry Pi 4", qtd: 1 }], 
        status: "Aprovado" 
    },
    { 
        id: 1020, aluno: "Carlos Lima", login: "cl", data: "2026-01-20", 
        finalidade: "Pesquisa CIn",
        itens: [{ nome: "Multímetro Digital", qtd: 1 }], 
        status: "Ativo", 
        devolucao: "2026-02-05" // Exemplo de data de devolução
    }
];

// Variáveis de controle globais para o filtro
let filtroStatusAtual = 'todos';
let termoBuscaAtual = '';

/* --- INICIALIZAÇÃO --- */
document.addEventListener('DOMContentLoaded', () => {
    renderizarPainel();
    configurarSistemaDeFiltros()
});

/* --- RENDERIZAÇÃO DA TABELA --- */
function renderizarPainel(dadosParaExibir = solicitacoes) {
    const tbody = document.getElementById('admin-lista-corpo');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    const hoje = new Date().toISOString().split('T')[0];

    dadosParaExibir.forEach(sol => {
        const tr = document.createElement('tr');
        const isAtrasado = sol.status === 'Ativo' && sol.devolucao < hoje;
        const resumoItens = sol.itens.length > 1 
            ? `${sol.itens[0].nome} (+${sol.itens.length - 1})` 
            : sol.itens[0].nome;

        tr.innerHTML = `
            <td>#${sol.id}</td>
            <td>
                <div class="aluno-cell">
                    <strong>${sol.aluno}</strong>
                    <small>${sol.login}</small>
                </div>
            </td>
            <td>${formatarData(sol.data)}</td>
            <td>${resumoItens}</td>
            <td>
                <span class="badges badge-${sol.status.toLowerCase()} ${isAtrasado ? 'badge-atrasado' : ''}">
                    ${isAtrasado ? 'Atrasado' : sol.status}
                </span>
            </td>
            <td class="acoes-cell">
                <button class="btn-detalhes" onclick="verDetalhes(${sol.id})">Detalhes</button>
                ${gerenciarBotoes(sol)}
            </td>
        `;
        tbody.appendChild(tr);
    });
    atualizarContadores();
}

/* --- SISTEMA DE FILTRO CENTRALIZADO --- */
function configurarSistemaDeFiltros() {
    const inputBusca = document.getElementById('search-pedido');
    const botoesFiltro = document.querySelectorAll('.btn-filtro');

    // 1. Escuta a barra de busca
    if (inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            termoBuscaAtual = e.target.value.toLowerCase();
            aplicarFiltros();
        });
    }

    // 2. Escuta os botões de filtro (chips)
    botoesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualiza visual dos botões
            botoesFiltro.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Define o novo status e filtra
            filtroStatusAtual = btn.dataset.status;
            aplicarFiltros();
        });
    });
}

function aplicarFiltros() {
    const hoje = new Date().toISOString().split('T')[0];

    const dadosFiltrados = solicitacoes.filter(sol => {
        // Lógica de Status Real (Ativo vs Atrasado)
        let statusParaFiltro = sol.status.toLowerCase();
        if (sol.status === 'Ativo' && sol.devolucao < hoje) {
            statusParaFiltro = 'atrasado';
        }

        // Critério 1: O chip selecionado condiz?
        const passaNoFiltro = filtroStatusAtual === 'todos' || statusParaFiltro === filtroStatusAtual;

        // Critério 2: O termo da busca condiz?
        const passaNaBusca = 
            sol.aluno.toLowerCase().includes(termoBuscaAtual) ||
            sol.login.toLowerCase().includes(termoBuscaAtual) ||
            sol.id.toString().includes(termoBuscaAtual) ||
            sol.itens.some(i => i.nome.toLowerCase().includes(termoBuscaAtual));

        return passaNoFiltro && passaNaBusca;
    });

    renderizarPainel(dadosFiltrados);
}

/* --- LÓGICA DO MODAL (Com Data de Devolução) --- */
function verDetalhes(id) {
    const sol = solicitacoes.find(s => s.id === id);
    if(!sol) return;

    document.getElementById('det-id').innerText = "#" + sol.id;
    document.getElementById('det-status').innerHTML = `<span class="badges badge-${sol.status.toLowerCase()}">${sol.status}</span>`;
    document.getElementById('det-aluno').innerText = sol.aluno;
    document.getElementById('det-login').innerText = sol.login;
    document.getElementById('det-data').innerText = formatarData(sol.data);
    document.getElementById('det-finalidade').innerText = sol.finalidade || "Não informada";

    // Lógica para exibição de datas
    const campoDevolucao = document.getElementById('det-devolucao');
    const labelPrazo = document.getElementById('det-label-prazo');

    if (sol.status === 'Finalizado') {
        labelPrazo.innerText = "Devolvido em";
        campoDevolucao.innerText = formatarData(sol.dataDevolucaoReal);
        campoDevolucao.style.color = "#28a745"; // Verde para finalizado
    } else if (sol.devolucao) {
        labelPrazo.innerText = "Previsão de Devolução";
        campoDevolucao.innerText = formatarData(sol.devolucao);
        campoDevolucao.style.color = "#db1e2f"; // Vermelho para prazo
    } else {
        labelPrazo.innerText = "Previsão de Devolução";
        campoDevolucao.innerText = "A definir";
        campoDevolucao.style.color = "#888";
    }

    // Gerenciar área de entrega (Aparece apenas se status for Aprovado)
    const areaEntrega = document.getElementById('det-area-entrega');
    if (sol.status === 'Aprovado') {
        areaEntrega.style.display = 'block';
        const sugestao = new Date();
        sugestao.setDate(sugestao.getDate() + 7);
        document.getElementById('det-input-data').value = sugestao.toISOString().split('T')[0];
    } else {
        areaEntrega.style.display = 'none';
    }   

    const tbody = document.getElementById('det-lista-itens');
    tbody.innerHTML = sol.itens.map((item, index) => {
        let campoID = '';
        
        // Se estiver aprovado, mostra o input para preencher o patrimônio
        if (sol.status === 'Aprovado') {
            campoID = `<input type="text" class="input-patrimonio" data-index="${index}" 
                        placeholder="Ex: OSC-001" 
                        style="width: 80%; padding: 5px; border: 1px solid #90caf9; border-radius: 4px;">`;
        } else {
            // Se já foi entregue ou finalizado, mostra o ID que foi gravado
            campoID = item.patrimonio || '<span style="color:#ccc">N/A</span>';
        }

        return `
            <tr>
                <td style="text-align:left; padding: 10px 8px;">${item.nome}</td>
                <td style="text-align:center;"><strong>${item.qtd}</strong></td>
                <td style="text-align:center;">${campoID}</td>
            </tr>
        `;
    }).join('');

    document.getElementById('modal-detalhes').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function confirmarEntregaPeloModal() {
    const id = parseInt(document.getElementById('det-id').innerText.replace('#', ''));
    const dataEscolhida = document.getElementById('det-input-data').value;
    
    // Coleta todos os inputs de patrimônio preenchidos
    const inputsPatrimonio = document.querySelectorAll('.input-patrimonio');
    let todosPreenchidos = true;
    
    const sol = solicitacoes.find(s => s.id === id);
    
    if (sol) {
        // Salva os IDs de patrimônio dentro de cada item da solicitação
        inputsPatrimonio.forEach(input => {
            const idx = input.getAttribute('data-index');
            const valor = input.value.trim();
            
            if (!valor) todosPreenchidos = false;
            sol.itens[idx].patrimonio = valor; // Grava o ID no objeto original
        });

        if (!dataEscolhida || !todosPreenchidos) {
            alert("Por favor, selecione a data de devolução e informe o ID de todos os itens antes de confirmar.");
            return;
        }

        sol.status = 'Ativo';
        sol.devolucao = dataEscolhida;
        fecharModalDetalhes();
        renderizarPainel();
    }
}

function fecharModalDetalhes() {
    document.getElementById('modal-detalhes').style.display = 'none';
    document.body.style.overflow = 'auto';
}

/* --- AÇÕES DE STATUS --- */
function gerenciarBotoes(sol) {
    if (sol.status === 'Pendente') {
        return `
            <button class="btn-adm btn-check" onclick="mudarStatus(${sol.id}, 'Aprovado')">Aceitar</button>
            <button class="btn-adm btn-cancel" onclick="mudarStatus(${sol.id}, 'Recusado')">Recusar</button>
        `;
    } else if (sol.status === 'Aprovado') {
        return `<button class="btn-adm btn-deliver" onclick="mudarStatus(${sol.id}, 'Ativo')">Entregar</button>`;
    } else if (sol.status === 'Ativo') {
        return `<button class="btn-adm btn-finish" onclick="mudarStatus(${sol.id}, 'Finalizado')">Devolução</button>`;
    }
    return `<small style="color:#999">Concluído</small>`;
}

function mudarStatus(id, novoStatus) {
    const p = solicitacoes.find(s => s.id === id);
    if (p) {
        p.status = novoStatus;
        
        // Se o item for devolvido (Finalizado), grava a data de hoje
        if (novoStatus === 'Finalizado') {
            p.dataDevolucaoReal = new Date().toISOString().split('T')[0];
        }
        
        renderizarPainel();
    }
}

/* --- FILTROS E UTILITÁRIOS --- */



function configurarFiltrosCards() {
    const cards = document.querySelectorAll('.stat-card');
    if(cards[0]) cards[0].onclick = () => renderizarPainel(solicitacoes.filter(s => s.status === 'Pendente'));
    if(cards[1]) cards[1].onclick = () => renderizarPainel(solicitacoes.filter(s => s.status === 'Aprovado'));
    if(cards[2]) cards[2].onclick = () => {
        const hoje = new Date().toISOString().split('T')[0];
        renderizarPainel(solicitacoes.filter(s => s.status === 'Ativo' && s.devolucao < hoje));
    };
}

function atualizarContadores() {
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('count-novas').textContent = solicitacoes.filter(s => s.status === 'Pendente').length;
    document.getElementById('count-retirada').textContent = solicitacoes.filter(s => s.status === 'Aprovado').length;
    document.getElementById('count-atrasados').textContent = solicitacoes.filter(s => s.status === 'Ativo' && s.devolucao < hoje).length;
}

function formatarData(dataISO) {
    if(!dataISO) return '-';
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
}