// Aguarda o DOM estar pronto
document.addEventListener("DOMContentLoaded", () => {
  carregarDados();
});

async function carregarDados() {
  const painel = document.getElementById("painel");
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  try {
    // 1. Tenta buscar os dados.
    // O CAMINHO FOI CORRIGIDO AQUI para buscar na raiz.
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
        // Converte para o formato de moeda BRL
        valorFormatado = item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      } else {
        valorFormatado = item.valor; // Para o clima, etc.
      }

      // Monta o HTML interno do card
      // (Ajuste no valorFormatado para remover o "R$" duplicado, pois toLocaleString já inclui)
      card.innerHTML = `
        <h2>${item.nome}</h2>
        <p class="preco">${valorFormatado}</p>
        <p class="info">${item.info}</p>
      `;
      
      // Se a unidade não for 'R$', precisamos ajustar a exibição
      if (item.unidade !== "R$") {
         card.querySelector('.preco').innerHTML = valorFormatado;
      }


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
  try {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  } catch (e) {
    return dataISO; // Retorna a data original se o formato for inesperado
  }
}
