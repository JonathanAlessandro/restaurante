// Lógica da página administrativa de produtos
let filtroCategoriaAtual = 'all';
let buscaProdutoAtual = '';
let produtoEditandoId = null;

function obterProdutos() {
  return [
    { id: 1, name: 'Product 1', category: 'carnes', price: 10.00, description: 'Description of Product 1', image: '', special: false, paused: false },
    { id: 2, name: 'Product 2', category: 'frango', price: 15.00, description: 'Description of Product 2', image: '', special: true, paused: true }
  ];
}

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarProduto(produtoId, novosDados) {
  console.log(`Atualizando produto ${produtoId} com dados:`, novosDados);
}

function adicionarProduto(novoProduto) {
  console.log('Adicionando novo produto:', novoProduto);
}

function excluirProduto(produtoId) {
  console.log(`Excluindo produto ${produtoId}`);
}

document.addEventListener('DOMContentLoaded', function() {
  renderizarProdutosAdmin();
});

function renderizarProdutosAdmin() {
  let listaProdutos = obterProdutos();

  if (filtroCategoriaAtual !== 'all') {
    listaProdutos = listaProdutos.filter(produto => produto.category === filtroCategoriaAtual);
  }

  if (buscaProdutoAtual) {
    const termo = buscaProdutoAtual.toLowerCase();
    listaProdutos = listaProdutos.filter(produto =>
      produto.name.toLowerCase().includes(termo) ||
      produto.description?.toLowerCase().includes(termo)
    );
  }

  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  if (listaProdutos.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--gray-400);">
        <p>Nenhum produto encontrado</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = listaProdutos.map(produto => `
    <div class="product-admin-card ${produto.paused ? 'product-paused' : ''}">
      <img src="${produto.image || 'https://img.freepik.com/fotos-premium/a-autentica-marmita-brasileira-mais-conhecida-como-marmitex-feita-com-comida-tradicional-do-brasil_496782-2499.jpg?w=1480'}"
           alt="${produto.name}"
           class="product-admin-image"
           onerror="this.src='https://i.pinimg.com/736x/27/23/ff/2723ff296e8a82e13c65753f9348b35b.jpg'">
      <div class="product-admin-content">
        <div class="product-admin-header">
          <span class="product-admin-name">
            ${produto.name}
            ${produto.paused ? '<span class="paused-badge">Pausado</span>' : ''}
          </span>
          <span class="product-admin-price">${formatarMoeda(produto.price)}</span>
        </div>
        <p class="product-admin-category">${obterRotuloCategoria(produto.category)} ${produto.special ? '| Especial' : ''}</p>
        <div class="product-admin-actions">
          <button class="btn-sm btn-edit" onclick="editarProduto(${produto.id})">Editar</button>
          ${produto.paused
            ? `<button class="btn-sm btn-activate" onclick="alternarPausaProduto(${produto.id})">Ativar</button>`
            : `<button class="btn-sm btn-pause" onclick="alternarPausaProduto(${produto.id})">Pausar</button>`
          }
          <button class="btn-sm btn-delete" onclick="confirmarExclusaoProduto(${produto.id})">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filtrarProdutos(categoria, botao) {
  filtroCategoriaAtual = categoria;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  botao.classList.add('active');
  renderizarProdutosAdmin();
}

function buscarProdutos(termo) {
  buscaProdutoAtual = termo;
  renderizarProdutosAdmin();
}

function obterRotuloCategoria(categoria) {
  const labels = {
    carnes: 'Carnes',
    frango: 'Frango',
    peixes: 'Peixes',
    vegetariano: 'Vegetariano'
  };
  return labels[categoria] || categoria;
}

function abrirModalProduto(produtoId = null) {
  produtoEditandoId = produtoId;
  document.getElementById('productForm')?.reset();
  if (document.getElementById('productId')) document.getElementById('productId').value = '';

  if (produtoId) {
    const produtos = obterProdutos();
    const produto = produtos.find(p => p.id === produtoId);

    if (produto) {
      document.getElementById('productModalTitle').textContent = 'Editar Produto';
      document.getElementById('productId').value = produto.id;
      document.getElementById('productName').value = produto.name || '';
      document.getElementById('productDescription').value = produto.description || '';
      document.getElementById('productPrice').value = produto.price || '';
      document.getElementById('productOldPrice').value = produto.oldPrice || '';
      document.getElementById('productCategory').value = produto.category || '';
      document.getElementById('productImage').value = produto.image || '';
      document.getElementById('productSpecial').checked = produto.special || false;
    }
  } else {
    document.getElementById('productModalTitle').textContent = 'Novo Produto';
  }

  document.getElementById('productModal')?.classList.add('active');
}

function fecharModalProduto() {
  document.getElementById('productModal')?.classList.remove('active');
  produtoEditandoId = null;
}

function editarProduto(produtoId) {
  abrirModalProduto(produtoId);
}

function salvarProduto() {
  const nome = document.getElementById('productName')?.value.trim();
  const descricao = document.getElementById('productDescription')?.value.trim();
  const preco = parseFloat(document.getElementById('productPrice')?.value);
  const precoAntigo = parseFloat(document.getElementById('productOldPrice')?.value) || null;
  const categoria = document.getElementById('productCategory')?.value;
  const imagem = document.getElementById('productImage')?.value.trim();
  const especial = document.getElementById('productSpecial')?.checked;

  if (!nome || !preco || !categoria) {
    alert('Por favor, preencha os campos obrigatórios');
    return;
  }

  const produtoDados = {
    name: nome,
    description: descricao,
    price: preco,
    oldPrice: precoAntigo,
    category: categoria,
    image: imagem || 'https://placehold.co/400x300/f3f4f6/9ca3af?text=Sem+Imagem',
    special: especial
  };

  if (produtoEditandoId) {
    atualizarProduto(produtoEditandoId, produtoDados);
  } else {
    adicionarProduto(produtoDados);
  }

  fecharModalProduto();
  renderizarProdutosAdmin();
}

function alternarPausaProduto(produtoId) {
  const produtos = obterProdutos();
  const produto = produtos.find(p => p.id === produtoId);

  if (produto) {
    atualizarProduto(produtoId, { paused: !produto.paused });
    renderizarProdutosAdmin();
  }
}

function confirmarExclusaoProduto(produtoId) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    excluirProduto(produtoId);
    renderizarProdutosAdmin();
  }
}

const getProducts = obterProdutos;
const formatCurrency = formatarMoeda;
const updateProduct = atualizarProduto;
const addProduct = adicionarProduto;
const deleteProduct = excluirProduto;
const renderProductsAdmin = renderizarProdutosAdmin;
const filterProducts = filtrarProdutos;
const searchProducts = buscarProdutos;
const getCategoryLabel = obterRotuloCategoria;
const openProductModal = abrirModalProduto;
const closeProductModal = fecharModalProduto;
const editProduct = editarProduto;
const saveProduct = salvarProduto;
const toggleProductPause = alternarPausaProduto;
const confirmDeleteProduct = confirmarExclusaoProduto;
