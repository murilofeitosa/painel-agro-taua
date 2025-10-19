// Aguarda o DOM estar pronto
document.addEventListener("DOMContentLoaded", () => {
  carregarDados();
});

async function carregarDados() {
  const painel = document.getElementById("painel");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  try {
    // 1. Tenta buscar os dados
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
      card.id = `card-${item.id}`; // Adiciona um ID para estilização específica se precisar

      // Formata o valor
      let valorFormatado = "";
      if (item.unidade === "R$") {
        valorFormatado = `R$ ${item.valor.toFixed(2)}`;
      } else {
        valorFormatado = item.valor; // Para o clima, etc.
      }

      // Monta o HTML interno do card
      card.innerHTML = `
        <h2>${item.nome}</h2>
        <p class="preco">${valorFormatado}</p>
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

// Função auxiliar para formatar a data (opcional)
function formatarData(dataISO) {
  // Converte "2025-10-19" para "19/10/2025"
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}