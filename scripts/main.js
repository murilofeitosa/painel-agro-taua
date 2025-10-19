fetch('./data/precos.json')
  .then(response => response.json())
  .then(data => {
    document.getElementById('data').textContent = data.data;
    document.getElementById('ovinos').textContent = data.ovinos.toFixed(2);
    document.getElementById('caprinos').textContent = data.caprinos.toFixed(2);
    document.getElementById('salMineral').textContent = data.salMineral.toFixed(2);
    document.getElementById('racao').textContent = data.racao.toFixed(2);
    document.getElementById('clima').textContent = data.clima;
  })
  .catch(error => console.error('Erro ao carregar dados:', error));
