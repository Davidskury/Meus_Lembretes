# 📌 Meus Lembretes — Gerenciador de Tarefas

Um painel web intuitivo e funcional para criação, gerenciamento, organização e filtragem de lembretes diários. O projeto foi desenvolvido como aplicação de página única (*Single Page Application*), priorizando a experiência do usuário e a persistência dos dados no próprio navegador.

🔗 **Acesse a aplicação online:** [https://Davidskury.github.io/Meus_Lembretes/](https://Davidskury.github.io/Meus_Lembretes/)

---

## 🚀 Funcionalidades

- **📝 Cadastro de Lembretes:**
  - Descrição da tarefa com validação de campos obrigatórios.
  - Atribuição de prioridade (**Baixa**, **Média** ou **Alta**).
  - Data de vencimento opcional.
  - Atalho via tecla `Enter` para adicionar rapidamente.

- **🔍️ Busca & Filtros em Tempo Real:**
  - Pesquisa por texto/palavra-chave na descrição do lembrete.
  - Filtro por **Status** (Todos, Ativos ou Concluídos).
  - Filtro por Nível de **Prioridade**.
  - Filtro por **Data de Vencimento**.

- **⚙️ Gerenciamento e Interação:**
  - Marcador visual de status (Concluído / Pendente).
  - Modal dinâmico para edição de lembretes existentes.
  - Remoção individual de tarefas.
  - **Exclusão em Lote:** Botão dedicado para limpar todos os lembretes concluídos de uma só vez.
  - Contador dinâmico de progresso (*ex: 2 de 5 concluídos*).

- **💾 Persistência Local:**
  - Integração com a API `localStorage` do navegador para manter as informações salvas mesmo após atualizar ou fechar a página.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica da aplicação.
- **CSS3:** Estilização moderna, suporte a layout responsivo e transições suaves.
- **JavaScript (ES6+):** Manipulação dinâmica do DOM, tratamento de eventos e gerenciamento de armazenamento local.
- **GitHub Pages:** Hospedagem e *deploy* contínuo da aplicação.

---

## 💻 Como Rodar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/ViniciusSendoski/Web_I_Lembretes.git](https://github.com/ViniciusSendoski/Web_I_Lembretes.git)
