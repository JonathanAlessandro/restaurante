class CatalogoProdutos {
  constructor(jsonUrl, sectionsContainer) {
    this.jsonUrl = jsonUrl;
    this.sectionsContainer = sectionsContainer;
    this.produtosData = [];
  }

  async carregarProdutos() {
    const response = await fetch(this.jsonUrl);
    this.produtosData = await response.json();
    this.renderizarSecoes();
  }

  obterProdutoPorId(id) {
    return this.produtosData.find(produto => produto.id === Number(id));
  }

  renderizarSecoes() {
    if (!this.sectionsContainer) return;
    this.sectionsContainer.innerHTML = '';

    const ordemCategorias = ['frangos', 'carnes', 'especiais', 'super', 'outros'];
    const rotulosCategoria = {
      frangos: 'Frangos',
      carnes: 'Carnes',
      especiais: 'Especiais',
      super: 'Super Pratos',
      outros: 'Outros'
    };

    const produtosPorCategoria = this.produtosData.reduce((acc, produto) => {
      const categoria = produto.categoria || 'outros';
      acc[categoria] = acc[categoria] || [];
      acc[categoria].push(produto);
      return acc;
    }, {});

    ordemCategorias.forEach(categoria => {
      const produtos = produtosPorCategoria[categoria];
      if (!produtos) return;

      const label = rotulosCategoria[categoria] || categoria;

      this.sectionsContainer.insertAdjacentHTML('beforeend', `
        <div class="lista-opcoes-wrapper">
          <h2>${label}</h2>
          <div class="lista-opcoes">
            <div class="menu-especiais">
              <div class="titulo-secao-especiais"></div>
              <div class="lista-cartoes">
                ${produtos.map(produto => this.criarCartaoProdutoHTML(produto)).join('')}
              </div>
            </div>
          </div>
        </div>
      `);
    });
  }

  criarCartaoProdutoHTML(produto) {
    const preco = produto.preco.toFixed(2).replace('.', ',');
    return `
      <a href="#" class="cartao-produto" data-categoria="${produto.categoria}" data-modal-target="product-modal" data-product-id="${produto.id}">
        <div class="imagem-quadrada">
          <img src="${produto.imagem}" alt="${produto.nome}">
        </div>
        <p class="marca">${produto.marca || ''}</p>
        <p class="nome-produto">${produto.nome}</p>
        <div class="box-preco">
          <span class="preco">R$ ${preco}</span>
        </div>
      </a>
    `;
  }
}

const ProductCatalog = CatalogoProdutos;
