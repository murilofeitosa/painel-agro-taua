// Aguarda o DOM estar pronto
document.addEventListener("DOMContentLoaded", () => {
  carregarDados();
  configurarModal(); // Nova função para o Modal
});

async function carregarDados() {
  const painel = document.getElementById("painel");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  try {
    // 1. Tenta buscar os dados (da raiz do projeto)
    const response = await fetch('./precos.json'); 
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();

    // 2. Esconde o loading
    loading.style.display = "none";

    // 3. Atualiza os dados do cabeçalho e rodapé
    document.getElementById("data-atualizacao").textContent = formatarData(data.dataAtualizacao);
    document.getElementById("local").textContent = data.local;

    // 4. Gera os cards dinamicamente
    data.itens.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.id = `card-${item.id}`;

      // --- MELHORIA: Adiciona classe de destaque para o clima ---
      if (item.id === 'clima') {
        card.classList.add('card-clima');
      }

      // Formata o valor principal
      let valorFormatado = "";
      if (item.unidade === "R$") {
        valorFormatado = item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      } else {
        valorFormatado = item.valor; // Para o clima, etc.
      }

      // --- MELHORIA: Lógica da Variação ---
      let variacaoHTML = '';
      if (item.valorAnterior != null && item.id !== 'clima') {
        if (item.valor > item.valorAnterior) {
          variacaoHTML = `<span class="variacao alta">▲</span>`;
        } else if (item.valor < item.valorAnterior) {
          variacaoHTML = `<span class="variacao baixa">▼</span>`;
        } else {
          variacaoHTML = `<span class="variacao neutra">▬</span>`;
        }
      }

      // Monta o HTML interno do card
      card.innerHTML = `
        <h2>${item.nome}</h2>
        <p class="preco">
          ${valorFormatado}
          ${variacaoHTML}
        </p>
        <p class="info">${item.info}</p>
      `;

      // Adiciona o card criado ao painel
      painel.appendChild(card);
    });

  } catch (err) {
    // 5. Em caso de erro, esconde o loading e mostra a mensagem de erro
    console.error('Erro ao carregar dados:', err);
    loading.style.display = "none";
    error.style.display = "block";
  }
}

// Função auxiliar para formatar a data
function formatarData(dataISO) {
  try {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return dataISO; // Retorna a data original se o formato for inesperado
  }
}

// --- MELHORIA: Função para controlar o Modal ---
function configurarModal() {
  const modal = document.getElementById('modal-sobre');
  const abrir = document.getElementById('abrir-modal');
  const fechar = document.getElementById('fechar-modal');

  // Checa se os elementos existem antes de adicionar eventos
  if (modal && abrir && fechar) {
    abrir.onclick = (e) => {
      e.preventDefault(); // Impede o link '#' de pular a página
      modal.style.display = 'flex';
    }
    
    fechar.onclick = () => {
      modal.style.display = 'none';
    }
    
    // Fecha o modal se clicar fora do conteúdo (no overlay)
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    }
  } else {
    console.error("Elementos do modal não encontrados.");
  }
}
