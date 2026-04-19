class AplicativoMarmita {
  constructor() {
    this.sectionsContainer = document.getElementById('produtos-secoes');
    this.modalContainer = document.getElementById('modais-container');
    this.catalogo = new CatalogoProdutos('data/marmitas.json', this.sectionsContainer);
    this.gerenciadorCarrinho = new GerenciadorCarrinho();
    this.gerenciadorModal = new GerenciadorModal(
      this.modalContainer,
      id => this.catalogo.obterProdutoPorId(id),
      (produto, quantidade) => this.gerenciadorCarrinho.adicionarItem(produto, quantidade)
    );
  }

  async init() {
    await this.catalogo.carregarProdutos();
    this.gerenciadorModal.iniciar();
    this.vincularFiltroDeCategoria();
  }

  vincularFiltroDeCategoria() {
    document.querySelectorAll('.item-categoria').forEach(cat => {
      cat.addEventListener('click', e => {
        e.preventDefault();
        const categoria = cat.dataset.categoria;

        document.querySelectorAll('.cartao-produto').forEach(prod => {
          prod.style.display = !categoria || prod.dataset.categoria === categoria ? 'block' : 'none';
        });

        document.getElementById('produtos-container')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  vincularAcoesGlobais() {
    window.irParaCarrinho = this.gerenciadorCarrinho.abrirCarrinhoMobile.bind(this.gerenciadorCarrinho);
    window.fecharCarrinhoMobile = this.gerenciadorCarrinho.fecharCarrinhoMobile.bind(this.gerenciadorCarrinho);
    window.goToCart = window.irParaCarrinho;
    window.closeMobileCart = window.fecharCarrinhoMobile;
    window.obterLocalizacao = this.obterLocalizacao.bind(this);
    window.enviarPedido = this.enviarPedido.bind(this);
    window.getCarrinhoData = () => this.gerenciadorCarrinho.carrinho;
  }

  obterLocalizacao() {
    const status = document.getElementById('statusLocalizacao');
    const inputEndereco = document.getElementById('enderecoManual');

    if (!navigator.geolocation) {
      if (status) status.innerHTML = 'Geolocalização não suportada.';
      return;
    }

    if (status) status.innerHTML = 'Buscando coordenadas...';

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      if (status) status.innerHTML = 'Convertendo para endereço...';

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();

        if (data.address) {
          const rua = data.address.road || '';
          const numero = data.address.house_number || 'S/N';
          const bairro = data.address.suburb || data.address.neighbourhood || '';
          const cidade = data.address.city || data.address.town || '';
          const enderecoCompleto = `${rua}, ${numero} - ${bairro}, ${cidade}`;

          if (inputEndereco) inputEndereco.value = enderecoCompleto;
          if (status) {
            status.innerHTML = 'Endereço preenchido!';
            status.style.color = 'green';
          }
        } else if (status) {
          status.innerHTML = 'Endereço não encontrado, digite manualmente.';
        }
      } catch (error) {
        console.error(error);
        if (status) status.innerHTML = 'Erro ao buscar endereço. Digite manualmente.';
        if (inputEndereco) inputEndereco.value = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
      }
    }, (error) => {
      if (status) {
        status.innerHTML = 'Erro: ' + error.message;
        status.style.color = 'red';
      }
    });
  }

  async enviarPedido() {
    const nome = document.getElementById('nomeCliente')?.value;
    const telefone = document.getElementById('telefoneCliente')?.value;
    const endereco = document.getElementById('enderecoManual')?.value;
    const carrinho = this.gerenciadorCarrinho.carrinho;

    if (!nome || !telefone || !endereco) {
      alert('Preencha todos os campos!');
      return;
    }

    if (carrinho.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    const pedido = {
      cliente: { nome, telefone, endereco },
      itens: carrinho,
      total: carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0)
    };

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      if (response.ok) {
        this.gerenciadorCarrinho.limparCarrinho();
        window.location.href = 'success.html';
      } else {
        alert('Erro ao enviar pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro de conexão. Tente novamente.');
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const aplicativo = new AplicativoMarmita();
  await aplicativo.init();
  aplicativo.vincularAcoesGlobais();
});
