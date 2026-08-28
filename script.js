// ==========================================================
// 1. SELEÇÃO DOS ELEMENTOS HTML
// ==========================================================
const inputTexto = document.querySelector('#input-texto');       
const selectPrioridade = document.querySelector('#select-prioridade'); 
const inputDataVencimento = document.querySelector('#input-data-vencimento'); 
const btnAdicionar = document.querySelector('#btn-adicionar');   
const listaLembretes = document.querySelector('#lista-lembretes'); 
const msgErro = document.querySelector('#msg-erro');             

// Elementos de Busca e Filtros
const inputBusca = document.querySelector('#input-busca');
const filtroStatus = document.querySelector('#filtro-status');
const filtroPrioridade = document.querySelector('#filtro-prioridade');
const filtroData = document.querySelector('#filtro-data');
const btnBuscar = document.querySelector('#btn-buscar');

// Elementos do Painel Inferior (Contador e Exclusão Coletiva)
const contadorConcluidos = document.querySelector('#contador-concluidos');
const btnExcluirConcluidos = document.querySelector('#btn-excluir-concluidos');

const PRIORIDADE_PADRAO = 'baixa';
const CHAVE_LOCALSTORAGE = 'meus_lembretes_app';

// ==========================================================
// FUNÇÃO AUXILIAR: Formata datas
// ==========================================================
function formatarDataVencimento(valorData) {
  if (!valorData || valorData.trim() === '') {
    return 'Sem data de vencimento';
  }

  if (valorData.includes('-')) {
    const partes = valorData.split('-');
    const ano = partes[0] || '';
    const mes = partes[1] || '';
    const dia = partes[2] || '';

    if (!dia && !mes && ano) return `Data: / /${ano}`;
    if (!dia && mes && ano) return `Data: /${mes}/${ano}`;
    
    return `Data: ${dia}/${mes}/${ano}`;
  }

  return `Data: ${valorData}`;
}

// ==========================================================
// FUNÇÃO AUXILIAR: Atualiza o contador de concluídos
// ==========================================================
function atualizarContador() {
  const lembretesSalvos = carregarLembretesStorage();
  const total = lembretesSalvos.length;
  const concluidos = lembretesSalvos.filter(item => item.concluido).length;
  contadorConcluidos.textContent = `${concluidos} de ${total} concluído(s)`;
}

// ==========================================================
// 2. FUNÇÃO PRINCIPAL: adiciona um novo lembrete à lista
// ==========================================================
function adicionarLembrete() {
  const texto = inputTexto.value.trim();
  const prioridade = selectPrioridade.value;
  const dataVencimento = inputDataVencimento.value;

  if (texto === '') {
    msgErro.textContent = 'Por favor, digite a descrição do lembrete!';
    inputTexto.focus(); 
    return; 
  }

  msgErro.textContent = '';
  const dataCriacao = new Date().toLocaleDateString('pt-BR');

  const lembretesSalvos = carregarLembretesStorage(); 
  lembretesSalvos.push({ texto, prioridade, dataCriacao, dataVencimento, concluido: false });        
  salvarLembretesStorage(lembretesSalvos);            
  
  // Limpeza dos campos
  inputTexto.value = '';
  inputDataVencimento.value = '';
  selectPrioridade.value = PRIORIDADE_PADRAO;
  inputTexto.focus();

  // Atualiza a exibição e o contador
  aplicarFiltrosEExibir();
}

// ==========================================================
// 3. CRIAÇÃO DO CARD
// ==========================================================
function criarCardLembrete(texto, prioridade, concluido = false, dataCriacao = null, dataVencimento = null) {
  const card = document.createElement('div');
  card.classList.add('card-item', prioridade);
  card.style.display = 'flex';
  card.style.justifyContent = 'space-between';
  card.style.alignItems = 'center';
  card.style.padding = '12px';
  card.style.marginBottom = '8px';
  card.style.borderRadius = '6px';
  card.style.transition = 'background-color 0.3s ease';

  const infoWrapper = document.createElement('div');

  const btnChecklist = document.createElement('button');
  btnChecklist.type = 'button';
  btnChecklist.style.display = 'inline-flex';
  btnChecklist.style.alignItems = 'center';
  btnChecklist.style.width = 'fit-content';
  btnChecklist.style.maxWidth = '100%';
  btnChecklist.style.backgroundColor = '#007bff';
  btnChecklist.style.color = '#ffffff';
  btnChecklist.style.border = 'none';
  btnChecklist.style.padding = '6px 12px';
  btnChecklist.style.borderRadius = '4px';
  btnChecklist.style.cursor = 'pointer';
  btnChecklist.style.marginBottom = '8px';
  btnChecklist.style.font = 'inherit';

  const spanCaixa = document.createElement('span');
  spanCaixa.style.display = 'inline-flex';
  spanCaixa.style.alignItems = 'center';
  spanCaixa.style.justifyContent = 'center';
  spanCaixa.style.width = '18px';
  spanCaixa.style.height = '18px';
  spanCaixa.style.minWidth = '18px';
  spanCaixa.style.border = '2px solid #ffffff';
  spanCaixa.style.borderRadius = '3px';
  spanCaixa.style.marginRight = '8px';
  spanCaixa.style.fontWeight = 'bold';
  spanCaixa.style.fontSize = '12px';

  const spanTexto = document.createElement('span');
  spanTexto.textContent = texto;
  spanTexto.style.fontWeight = 'bold';
  spanTexto.style.wordBreak = 'break-word';

  btnChecklist.append(spanCaixa, spanTexto);

  const paragrafo = document.createElement('div');
  paragrafo.appendChild(btnChecklist);

  const elPrioridade = document.createElement('small');
  elPrioridade.style.display = 'block';
  elPrioridade.textContent = `Prioridade: ${prioridade.toLowerCase()}`;

  const elDataCriacao = document.createElement('small');
  elDataCriacao.style.display = 'block';
  const textoCriacao = dataCriacao ? dataCriacao : new Date().toLocaleDateString('pt-BR');
  elDataCriacao.textContent = `Criado em: ${textoCriacao}`;

  const elDataVencimento = document.createElement('small');
  elDataVencimento.style.display = 'block';
  elDataVencimento.textContent = formatarDataVencimento(dataVencimento);

  infoWrapper.append(paragrafo, elPrioridade, elDataCriacao, elDataVencimento);

  const estiloBotaoBase = (btn, corHex) => {
    btn.style.backgroundColor = 'transparent';
    btn.style.color = corHex;
    btn.style.border = `1px solid ${corHex}`;
    btn.style.padding = '5px 10px';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.opacity = '0.7';
    btn.style.transition = 'all 0.2s ease';

    btn.addEventListener('mouseenter', () => {
      if (!btn.disabled) btn.style.opacity = '1';
    });
    btn.addEventListener('mouseleave', () => {
      if (!btn.disabled) btn.style.opacity = '0.7';
    });
  };

  const acoesWrapper = document.createElement('div');
  acoesWrapper.style.display = 'flex';
  acoesWrapper.style.gap = '8px';

  const btnEditar = document.createElement('button');
  btnEditar.type = 'button';
  btnEditar.textContent = 'Editar';
  estiloBotaoBase(btnEditar, '#007bff');

  const btnDeletar = document.createElement('button');
  btnDeletar.type = 'button';
  btnDeletar.textContent = 'Excluir';
  btnDeletar.setAttribute('aria-label', `Excluir lembrete: ${texto}`);
  estiloBotaoBase(btnDeletar, '#dc3545');

  acoesWrapper.append(btnEditar, btnDeletar);

  function aplicarEstiloConcluido(estaConcluido) {
    if (estaConcluido) {
      spanCaixa.textContent = 'X';
      card.style.backgroundColor = '#e9ecef';
      card.style.opacity = '0.85';

      elPrioridade.style.textDecoration = 'line-through';
      spanTexto.style.textDecoration = 'none';

      btnEditar.disabled = true;
      btnEditar.style.opacity = '0.3';
      btnEditar.style.cursor = 'not-allowed';
    } else {
      spanCaixa.textContent = '';
      card.style.backgroundColor = '';
      card.style.opacity = '1';

      elPrioridade.style.textDecoration = 'none';
      spanTexto.style.textDecoration = 'none';

      btnEditar.disabled = false;
      btnEditar.style.opacity = '0.7';
      btnEditar.style.cursor = 'pointer';
    }
  }

  if (concluido) {
    aplicarEstiloConcluido(true);
  }

  btnChecklist.addEventListener('click', (e) => {
    e.stopPropagation();
    const estaConcluido = spanCaixa.textContent === 'X';
    const novoEstado = !estaConcluido;

    aplicarEstiloConcluido(novoEstado);
    atualizarStatusStorage(texto, prioridade, novoEstado);
    atualizarContador();
  });

  btnEditar.addEventListener('click', (evento) => {
    evento.stopPropagation();
    if (btnEditar.disabled) return;

    abrirModalEdicao(texto, prioridade, dataVencimento, (novoTexto, novaPrioridade, novaDataVencimento) => {
      atualizarLembreteStorage(texto, prioridade, novoTexto, novaPrioridade, novaDataVencimento);
      aplicarFiltrosEExibir();
    });
  });

  btnDeletar.addEventListener('click', (evento) => {
    evento.stopPropagation();
    removerLembreteStorage(texto, prioridade);
    aplicarFiltrosEExibir();
  });

  card.append(infoWrapper, acoesWrapper);

  return card;
}

// ==========================================================
// POPUP / MODAL DE EDIÇÃO
// ==========================================================
function abrirModalEdicao(textoAtual, prioridadeAtual, dataVencimentoAtual, onSalvar) {
  const modalOverlay = document.createElement('div');
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100vw';
  modalOverlay.style.height = '100vh';
  modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '1000';

  const modalContainer = document.createElement('div');
  modalContainer.style.backgroundColor = '#fff';
  modalContainer.style.padding = '20px';
  modalContainer.style.borderRadius = '8px';
  modalContainer.style.minWidth = '300px';
  modalContainer.style.display = 'flex';
  modalContainer.style.flexDirection = 'column';
  modalContainer.style.gap = '10px';

  const titulo = document.createElement('h3');
  titulo.style.margin = '0';
  titulo.textContent = 'Editar Lembrete';

  const inputEdicao = document.createElement('input');
  inputEdicao.type = 'text';
  inputEdicao.value = textoAtual;

  const selectEdicao = document.createElement('select');
  ['baixa', 'media', 'alta'].forEach((p) => {
    const option = document.createElement('option');
    option.value = p;
    option.textContent = p.charAt(0).toUpperCase() + p.slice(1);
    if (p === prioridadeAtual) option.selected = true;
    selectEdicao.appendChild(option);
  });

  const labelData = document.createElement('label');
  labelData.textContent = 'Data de Vencimento:';
  labelData.style.fontSize = '12px';
  
  const inputDataEdicao = document.createElement('input');
  inputDataEdicao.type = 'date';
  inputDataEdicao.value = dataVencimentoAtual || '';

  const botoesContainer = document.createElement('div');
  botoesContainer.style.display = 'flex';
  botoesContainer.style.justifyContent = 'flex-start';
  botoesContainer.style.gap = '10px';
  botoesContainer.style.marginTop = '10px';

  const btnSalvar = document.createElement('button');
  btnSalvar.textContent = 'Salvar';

  const btnCancelar = document.createElement('button');
  btnCancelar.textContent = 'Cancelar';

  botoesContainer.append(btnSalvar, btnCancelar);
  modalContainer.append(titulo, inputEdicao, selectEdicao, labelData, inputDataEdicao, botoesContainer);
  modalOverlay.appendChild(modalContainer);
  document.body.appendChild(modalOverlay);

  btnSalvar.addEventListener('click', () => {
    const novoTexto = inputEdicao.value.trim();
    if (novoTexto !== '') {
      onSalvar(novoTexto, selectEdicao.value, inputDataEdicao.value);
      document.body.removeChild(modalOverlay);
    }
  });

  btnCancelar.addEventListener('click', () => {
    document.body.removeChild(modalOverlay);
  });
}

// ==========================================================
// 4. LÓGICA DE FILTRAGEM E EXIBIÇÃO DE LEMBRETES
// ==========================================================
function aplicarFiltrosEExibir() {
  listaLembretes.innerHTML = '';
  const lembretesSalvos = carregarLembretesStorage();

  const textoBusca = inputBusca.value.toLowerCase().trim();
  const valStatus = filtroStatus.value;
  const valPrioridade = filtroPrioridade.value;
  const valData = filtroData.value;

  const filtrados = lembretesSalvos.filter((item) => {
    // Filtro por Texto
    const bateTexto = item.texto.toLowerCase().includes(textoBusca);

    // Filtro por Status
    let bateStatus = true;
    if (valStatus === 'ativo') bateStatus = !item.concluido;
    if (valStatus === 'concluido') bateStatus = item.concluido;

    // Filtro por Prioridade
    let batePrioridade = true;
    if (valPrioridade !== 'todas') batePrioridade = item.prioridade === valPrioridade;

    // Filtro por Data
    let bateData = true;
    if (valData) bateData = item.dataVencimento === valData;

    return bateTexto && bateStatus && batePrioridade && bateData;
  });

  filtrados.forEach((item) => {
    const card = criarCardLembrete(item.texto, item.prioridade, item.concluido, item.dataCriacao, item.dataVencimento);
    listaLembretes.appendChild(card);
  });

  atualizarContador();
}

// ==========================================================
// 5. FUNÇÕES AUXILIARES DO LOCALSTORAGE
// ==========================================================
function carregarLembretesStorage() {
  const dadosSalvos = localStorage.getItem(CHAVE_LOCALSTORAGE);
  return dadosSalvos ? JSON.parse(dadosSalvos) : [];
}

function salvarLembretesStorage(lista) {
  localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(lista));
}

function removerLembreteStorage(texto, prioridade) {
  const lembretesSalvos = carregarLembretesStorage();
  const listaFiltrada = lembretesSalvos.filter((item) => {
    return !(item.texto === texto && item.prioridade === prioridade);
  });
  salvarLembretesStorage(listaFiltrada);
}

// REQUISITO 4.2.1: Excluir todos os marcados como concluídos
function excluirConcluidosStorage() {
  const lembretesSalvos = carregarLembretesStorage();
  const apenasAtivos = lembretesSalvos.filter((item) => !item.concluido);
  salvarLembretesStorage(apenasAtivos);
}

function atualizarStatusStorage(texto, prioridade, concluido) {
  const lembretesSalvos = carregarLembretesStorage();
  const item = lembretesSalvos.find((i) => i.texto === texto && i.prioridade === prioridade);
  if (item) {
    item.concluido = concluido;
    salvarLembretesStorage(lembretesSalvos);
  }
}

function atualizarLembreteStorage(textoAntigo, prioridadeAntiga, novoTexto, novaPrioridade, novaDataVencimento) {
  const lembretesSalvos = carregarLembretesStorage();
  const item = lembretesSalvos.find((i) => i.texto === textoAntigo && i.prioridade === prioridadeAntiga);
  if (item) {
    item.texto = novoTexto;
    item.prioridade = novaPrioridade;
    item.dataVencimento = novaDataVencimento;
    salvarLembretesStorage(lembretesSalvos);
  }
}

// ==========================================================
// 6. EVENTOS DA PÁGINA
// ==========================================================
document.addEventListener('DOMContentLoaded', aplicarFiltrosEExibir);

btnAdicionar.addEventListener('click', adicionarLembrete);

inputTexto.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    evento.preventDefault();
    adicionarLembrete();
  }
});

inputTexto.addEventListener('input', () => {
  if (msgErro.textContent) msgErro.textContent = '';
});

// Evento do Botão Buscar (e busca em tempo real conforme digita)
btnBuscar.addEventListener('click', aplicarFiltrosEExibir);
inputBusca.addEventListener('input', aplicarFiltrosEExibir);

// REQUISITO 4.2.1: Clique no botão de excluir concluídos
btnExcluirConcluidos.addEventListener('click', () => {
  excluirConcluidosStorage();
  aplicarFiltrosEExibir();
});