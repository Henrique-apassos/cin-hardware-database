/* Função para verificar CPF */
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

document.addEventListener('DOMContentLoaded', () => {
    // Entrada de CPF
    const cpfInput = document.getElementById('cpf-tecnico');
    cpfInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
        if (value.length > 11) value = value.slice(0, 11); // Limita a 11 dígitos

        // Aplica a máscara 000.000.000-00
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d)/, "$1.$2");
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        e.target.value = value;
    });

    // Define a data atual automaticamente no carregamento
    const campoData = document.getElementById('data-entrada');
    if (campoData) {
        const hoje = new Date();
        campoData.textContent = hoje.toLocaleDateString('pt-BR');
    }
    //  Configura o formulário de adição
    const formAdd = document.getElementById('form-add-temp');
    if (formAdd) {
        formAdd.addEventListener('submit', (e) => {
            e.preventDefault();
            adicionarItemLista();
        });
    }
});

/**
 * Alterna a exibição do campo de prefixo quando o tipo muda
 */
function alternarCamposTipo() {
    const tipo = document.getElementById('novo-tipo').value;
    const campoExtra = document.getElementById('campo-equipamento-extra');

    if (tipo === 'equipamento') {
        campoExtra.style.display = 'block';
    } else {
        campoExtra.style.display = 'none';
        document.getElementById('novo-prefixo').value = '';
    }
}

/**
 * Adiciona o componente preenchido à lista de conferência
 */
function adicionarItemLista() {
    const nome = document.getElementById('novo-nome').value;
    const tipo = document.getElementById('novo-tipo').value;
    const qtd = parseInt(document.getElementById('novo-qtd').value);
    const local = document.getElementById('novo-local').value;
    const min = document.getElementById('novo-min').value;
    const desc = document.getElementById('novo-desc').value;
    const prefixo = document.getElementById('novo-prefixo').value;

    // Criação do objeto do item
    const novoItem = {
        id_temp: Date.now(), // Identificador único para a lista temporária
        nome,
        tipo,
        qtd,
        local: local || 'Não especificado',
        qtd_min: min || 5,
        descricao: desc,
        prefixo: tipo === 'equipamento' ? prefixo : null
    };

    listaTemporaria.push(novoItem);
    renderizarListaTemporaria();
    limparCamposFormulario();
}

/**
 * Atualiza a tabela de pré-visualização na tela
 */
function renderizarListaTemporaria() {
    const tbody = document.getElementById('tbody-novos');
    const areaLista = document.getElementById('area-lista');

    if (listaTemporaria.length === 0) {
        areaLista.style.display = 'none';
        return;
    }

    areaLista.style.display = 'block';
    tbody.innerHTML = '';

    listaTemporaria.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = 'nova-linha'; // Ativa a animação definida no CSS

        tr.innerHTML = `
            <td>
                <div style="display:flex; flex-direction:column;">
                    <strong>${item.nome}</strong>
                    <small style="color:#888; text-transform: uppercase; font-size:0.7rem;">
                        ${item.tipo} ${item.prefixo ? `(${item.prefixo})` : ''}
                    </small>
                </div>
            </td>
            <td class="text-center"><strong>${item.qtd}</strong></td>
            <td>${item.local}</td>
            <td class="text-center">
                <button onclick="removerItem(${item.id_temp})" class="btn-icon" style="color:#db1e2f; border:none; background:none;">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Remove um item específico da lista antes de salvar
 */
function removerItem(id) {
    listaTemporaria = listaTemporaria.filter(item => item.id_temp !== id);
    renderizarListaTemporaria();
}

function limparCamposFormulario() {
    document.getElementById('novo-nome').value = '';
    document.getElementById('novo-qtd').value = '1';
    document.getElementById('novo-desc').value = '';
    document.getElementById('novo-nome').focus();
}

/* Validação e abertura do modal de confirmação */
function abrirModalConfirmacao() {
    const cpfInput = document.getElementById('cpf-tecnico');
    const cpfValue = cpfInput ? cpfInput.value : "";

    if (!validarCPF(cpfValue)) {
        alert("Por favor, informe um CPF válido para o técnico responsável.");
        cpfInput.focus();
        return;
    }

    if (listaTemporaria.length === 0) {
        alert("Adicione itens à lista antes de confirmar.");
        return;
    }

    // Preenche o modal
    document.getElementById('resp-modal').innerText = cpfValue;
    document.getElementById('data-modal').innerText = document.getElementById('data-entrada').textContent;
    document.getElementById('total-itens-modal').innerText = listaTemporaria.length;

    document.getElementById('modal-confirmacao').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-confirmacao').style.display = 'none';
}