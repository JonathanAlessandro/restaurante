class GerenciadorModal {
  constructor(modalContainer, obterProdutoPorId, aoAdicionarAoCarrinho) {
    this.modalContainer = modalContainer;
    this.obterProdutoPorId = obterProdutoPorId;
    this.aoAdicionarAoCarrinho = aoAdicionarAoCarrinho;
    this.modalElement = null;
  }

  iniciar() {
    this.renderizarEstruturaModal();
    document.addEventListener('click', event => this.lidarCliqueDocumento(event));
  }

  renderizarEstruturaModal() {
    if (!this.modalContainer) return;

    this.modalContainer.innerHTML = `
      <div id="product-modal" class="modal">
        <div class="modal-content">
          <span class="close-btn">&times;</span>
          <div class="modal-body-content"></div>
        </div>
      </div>
    `;
    this.modalElement = this.modalContainer.querySelector('.modal');
  }

  lidarCliqueDocumento(event) {
    const trigger = event.target.closest('[data-modal-target]');
    if (trigger) {
      event.preventDefault();
      const productId = trigger.dataset.productId;
      if (productId) {
        this.abrirModal(productId);
      }
      return;
    }

    if (event.target.classList.contains('close-btn') || event.target.classList.contains('modal')) {
      this.fecharModal();
    }
  }

  abrirModal(productId) {
    const produto = this.obterProdutoPorId(productId);
    if (!produto || !this.modalElement) return;

    this.preencherConteudoModal(produto);
    this.modalElement.classList.add('show');
  }

  fecharModal() {
    this.modalElement?.classList.remove('show');
  }

  preencherConteudoModal(produto) {
    if (!this.modalElement) return;

    const body = this.modalElement.querySelector('.modal-body-content');
    const preco = produto.preco.toFixed(2).replace('.', ',');
    const ingredientesHTML = produto.ingredientes?.length
      ? produto.ingredientes.map(i => `<li>${i}</li>`).join('')
      : '<li>Informação não disponível</li>';

    body.innerHTML = `
      <div class="modal-produto">
        <img src="${produto.imagem}" class="modal-header-img" alt="${produto.nome}">
        <div class="modal-content-inner">
          <h1 class="modal-nome">${produto.nome}</h1>
          <div class="ingredientes-box">
            <h4>Ingredientes</h4>
            <ul class="ingredientes-list">
              ${ingredientesHTML}
            </ul>
          </div>
          <h4>Guarnição</h4>
          <div class="linha-flex">
            <label><input type="radio" name="guarnicao" checked> Batata</label>
            <label><input type="radio" name="guarnicao"> Farofa</label>
            <label><input type="radio" name="guarnicao"> Cenoura</label>
          </div>
          <label class="checkbox">
            <input type="checkbox"> Preciso de talheres
          </label>
          <div class="quantidade-controle">
            <button class="menos" disabled>-</button>
            <span class="qtd">0</span>
            <button class="mais">+</button>
          </div>
          <p class="modal-price">R$ ${preco}</p>
          <button class="add-to-cart">Adicionar ao pedido</button>
        </div>
      </div>
    `;

    const menos = body.querySelector('.menos');
    const mais = body.querySelector('.mais');
    const qtdEl = body.querySelector('.qtd');
    let quantidade = 0;

    mais.addEventListener('click', () => {
      quantidade++;
      qtdEl.textContent = quantidade;
      if (menos) menos.disabled = false;
    });

    menos.addEventListener('click', () => {
      if (quantidade > 0) quantidade--;
      qtdEl.textContent = quantidade;
      if (menos) menos.disabled = quantidade === 0;
    });

    body.querySelector('.add-to-cart').addEventListener('click', () => {
      if (quantidade === 0) {
        alert('Selecione a quantidade');
        return;
      }
      this.aoAdicionarAoCarrinho(produto, quantidade);
      this.fecharModal();
    });
  }
}

const ModalManager = GerenciadorModal;
