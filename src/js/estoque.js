/* Configurações Gerais */
const MARGEM_SEGURANCA = 0.5; // Margem para avisar estoque baixo
/* Dados Simulados */
let estoqueData = [
    { 
        id: 1, 
        tipo: 'consumivel', 
        nome: "Resistor 1kΩ", 
        categoria: "Passivos", 
        local: null,
        qtd: 500, 
        qtd_min: 10,
        descricao: "Pacote de resistores 1/4W, tolerância 5%." 
    },
    { 
        id: 2, 
        tipo: 'equipamento', 
        nome: "Osciloscópio Digital", 
        categoria: "Instrumentação", 
        local: "Armário 2", // Local padrão/geral
        descricao: "Bancada 3 - Uso geral para aulas de eletrônica.",
        // Equipamentos possuem lista de unidades físicas
        qtd_min: 2,
        unidades: [
            { id: "OSC-01", local: "Bancada 1", status: "ok" },
            { id: "OSC-02", local: "Armário 2", status: "manutencao" },
            { id: "OSC-03", local: "Bancada 4", status: "ok" }
        ]
    },
    { 
        id: 3, 
        tipo: 'consumivel', 
        nome: "Capacitor Eletrolítico 10uF", 
        categoria: "Passivos", 
        local: "Gaveta B1", 
        qtd: 50,
        qtd_min: 5,
        descricao: "50V - Uso geral" 
    },
    { 
        id: 4, 
        tipo: 'equipamento', 
        nome: "Arduino Uno R3", 
        categoria: "Microcontroladores", 
        local: "Armário 1", 
        descricao: "Placa de desenvolvimento padrão.",
        qtd_min: 2,
        unidades: [
            { id: "ARD-105", local: "Armário 1", status: "ok" },
            { id: "ARD-106", local: "Armário 1", status: "quebrado" }
        ]
    }
];

document.addEventListener('DOMContentLoaded', () => {
    renderizarTabela(estoqueData);
    
    // Configura o evento de salvar do formulário
    const form = document.getElementById('form-item');
    if (form) {
        form.addEventListener('submit', salvarEdicao);
    }

    // Configura a busca em tempo real
    const inputBusca = document.getElementById('input-busca');
    if (inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const filtrados = estoqueData.filter(item => 
                item.nome.toLowerCase().includes(termo) || 
                item.categoria.toLowerCase().includes(termo) ||
                (item.local && item.local.toLowerCase().includes(termo)) ||
                item.id.toString().includes(termo)
            );
            renderizarTabela(filtrados);
        });
    }
});

// --- RENDERIZAÇÃO DA TABELA PRINCIPAL ---
function renderizarTabela(lista) {
    const tbody = document.getElementById('tbody-estoque');
    const msgVazio = document.getElementById('msg-vazio');
    
    tbody.innerHTML = '';

    if (lista.length === 0) {
        msgVazio.style.display = 'block';
        return;
    }
    msgVazio.style.display = 'none';

    lista.forEach(item => {
        // Lógica para definir a quantidade a ser exibida
        let qtdExibida = 0;
        if(item.tipo === 'consumivel') {
            qtdExibida = item.qtd;
        } else if (item.unidades) {
            qtdExibida = item.unidades.length;
        }

        // Lógica de Limites e Cores
        const limiteMinimo = item.qtd_min || 5;
        const limiteAviso = Math.ceil(limiteMinimo * (1 + MARGEM_SEGURANCA))

        let statusClass = 'status-ok';
        let statusTexto = 'Disponível';

        if(qtdExibida <= limiteMinimo){
            statusClass = 'status-crit';
            statusTexto = qtdExibida === 0? 'Esgotado' : 'Crítico';
        }
        else if (qtdExibida <= limiteAviso){
            statusClass = 'status-low';
            statusTexto = 'Baixo';
        }
        
        // Ícone de raio para diferenciar equipamentos
        const iconeTipo = item.tipo === 'equipamento' ? '<span title="Equipamento Rastreável" style="color:#db1e2f; font-weight:bold; cursor:help;"> ⚡</span>' : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${item.id}</td>
            <td>
                <strong>${item.nome}</strong>${iconeTipo}
            </td>
            <td>${item.categoria}</td>
            <td>${item.local || '<span style="color:#ccc">-</span>'}</td>
            <td class="text-center"><strong>${qtdExibida}</strong></td>
            <td class="text-center">
                <span class="status-dot ${statusClass}"></span>
                <span style="font-size: 0.85rem; font-weight: 600; color: #555;">${statusTexto}</span>
            </td>
            <td class="text-center">
                <button onclick="abrirModalEdicao(${item.id})" class="btn-icon" title="Editar / Detalhes">
                    <span class="material-symbols-outlined">Editar</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- LÓGICA DO MODAL DE EDIÇÃO ---
let itemAtual = null; // Variável global temporária para armazenar o item sendo editado

function abrirModalEdicao(id) {
    // Encontra o item original
    const item = estoqueData.find(i => i.id === id);
    if (!item) return;

    // Cria uma cópia para edição (Clone profundo simples)
    itemAtual = JSON.parse(JSON.stringify(item));

   // Preenche Campos Comuns
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
    
    setVal('item-id', itemAtual.id);
    setVal('item-nome', itemAtual.nome);
    setVal('item-cat', itemAtual.categoria);
    setVal('item-local', itemAtual.local || '');
    setVal('item-desc', itemAtual.descricao || '');
    setVal('item-tipo', itemAtual.tipo);
    setVal('item-qtd-min', itemAtual.qtd_min || 5); // Novo campo único de config

    // Alterna Interface (Consumível vs Equipamento)
    const areaConsumivel = document.getElementById('area-consumivel');
    const areaEquipamento = document.getElementById('area-equipamento');

    if (itemAtual.tipo === 'consumivel') {
        if(areaConsumivel) areaConsumivel.style.display = 'block';
        if(areaEquipamento) areaEquipamento.style.display = 'none';
        setVal('qtd-simples', itemAtual.qtd);
    } else {
        if(areaConsumivel) areaConsumivel.style.display = 'none';
        if(areaEquipamento) areaEquipamento.style.display = 'block';
        
        // Renderiza Tabela Interna
        renderizarUnidades(itemAtual.unidades || []);

        // Configura botão "+ Nova Unidade" para redirecionar
        const btnRedirect = document.getElementById('btn-redirect-unit');
        if(btnRedirect) {
            btnRedirect.onclick = function() {
                // Passa ID e Nome via URL para a página de adicionar unidade
                window.location.href = `adicionar_unidade.html?id=${itemAtual.id}&nome=${encodeURIComponent(itemAtual.nome)}`;
            };
        }
    }

    const modal = document.getElementById('modal-item');
    if(modal) modal.style.display = 'flex';
}

// Renderiza a tabelinha dentro do modal (apenas para equipamentos)
function renderizarUnidades(listaUnidades) {
    const tbody = document.getElementById('lista-unidades');
    if(!tbody) return;
    
    tbody.innerHTML = '';

    if (!listaUnidades || listaUnidades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center" style="padding:15px; color:#999;">Nenhuma unidade cadastrada.</td></tr>';
        return;
    }

    listaUnidades.forEach(uni => {
        let cor = '#28a745'; // Verde
        let texto = 'OK';
        
        if (uni.status === 'manutencao') { cor = '#fd7e14'; texto = 'Manutenção'; }
        else if (uni.status === 'quebrado') { cor = '#dc3545'; texto = 'Quebrado'; }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>${uni.id}</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">${uni.local}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee; color:${cor}; font-weight:bold">${texto}</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- SALVAR EDIÇÃO ---
function salvarEdicao(e) {
    e.preventDefault();
    if (!itemAtual) return;

    // Atualiza dados comuns
    itemAtual.nome = document.getElementById('item-nome').value;
    itemAtual.categoria = document.getElementById('item-cat').value;
    itemAtual.local = document.getElementById('item-local').value;
    itemAtual.descricao = document.getElementById('item-desc').value;
    itemAtual.qtd_min = parseInt(document.getElementById('item-qtd-min').value);

    // Atualiza quantidade se for consumível
    if (itemAtual.tipo === 'consumivel') {
        itemAtual.qtd = parseInt(document.getElementById('qtd-simples').value);
    }

    // Atualiza no Array Principal
    const index = estoqueData.findIndex(i => i.id === itemAtual.id);
    if (index !== -1) {
        estoqueData[index] = itemAtual;
    }

    renderizarTabela(estoqueData);
    fecharModal();
}

// --- FECHAR MODAL ---
function fecharModal() {
    const modal = document.getElementById('modal-item');
    if(modal) modal.style.display = 'none';
    itemAtual = null;
}

// Fecha clicando fora
window.onclick = function(event) {
    const modal = document.getElementById('modal-item');
    if (event.target == modal) fecharModal();
}