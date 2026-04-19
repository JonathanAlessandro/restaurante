// Base de dados de produtos
// Os produtos aqui usam a mesma estrutura de dados de compatibilidade
// com os scripts administrativos e páginas de carrinho/checkout legadas.
const produtos = [
  {
    id: 1,
    name: "Bife a cebolado",
    description: "Bife bovino grelhado com cebolas caramelizadas",
    price: 18.99,
    oldPrice: 24.99,
    category: "carnes",
    special: true,
    image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    name: "Frango grelhado",
    description: "Peito de frango grelhado com temperos especiais",
    price: 15.99,
    category: "frango",
    special: true,
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    name: "Picanha grelhada",
    description: "Picanha suculenta grelhada no ponto",
    price: 29.99,
    oldPrice: 35.99,
    category: "carnes",
    special: true,
    image: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    name: "Tilápia grelhada",
    description: "Filé de tilápia grelhado com ervas finas",
    price: 22.99,
    category: "peixes",
    special: true,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    name: "Contrafilé acebolado",
    description: "Contrafilé grelhado com cebolas",
    price: 19.99,
    category: "carnes",
    image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    name: "Costela bovina",
    description: "Costela assada lentamente",
    price: 25.99,
    category: "carnes",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    name: "Strogonoff de carne",
    description: "Strogonoff cremoso de carne bovina",
    price: 17.99,
    category: "carnes",
    image: "https://images.unsplash.com/photo-1675937494385-9c2f60c5b2c7?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    name: "Carne de panela",
    description: "Carne cozida com legumes",
    price: 16.99,
    category: "carnes",
    image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop"
  },
  {
    id: 9,
    name: "Frango à parmegiana",
    description: "Filé de frango empanado com molho e queijo",
    price: 18.99,
    category: "frango",
    image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop"
  },
  {
    id: 10,
    name: "Strogonoff de frango",
    description: "Strogonoff cremoso de frango",
    price: 16.99,
    category: "frango",
    image: "https://images.unsplash.com/photo-1619221882220-947b3d3c8861?w=400&h=300&fit=crop"
  },
  {
    id: 11,
    name: "Frango xadrez",
    description: "Frango em cubos com legumes orientais",
    price: 17.99,
    category: "frango",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop"
  },
  {
    id: 12,
    name: "Coxa de frango assada",
    description: "Coxa de frango temperada e assada",
    price: 14.99,
    category: "frango",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop"
  },
  {
    id: 13,
    name: "Salmão grelhado",
    description: "Filé de salmão grelhado com limão",
    price: 34.99,
    category: "peixes",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
  },
  {
    id: 14,
    name: "Bacalhau ao forno",
    description: "Bacalhau assado com batatas",
    price: 39.99,
    category: "peixes",
    image: "https://images.unsplash.com/photo-1559742811-822873691df8?w=400&h=300&fit=crop"
  },
  {
    id: 15,
    name: "Camarão alho e óleo",
    description: "Camarões salteados no alho",
    price: 36.99,
    category: "peixes",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop"
  },
  {
    id: 16,
    name: "Legumes grelhados",
    description: "Mix de legumes da estação grelhados",
    price: 14.99,
    category: "vegetariano",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
  },
  {
    id: 17,
    name: "Berinjela à parmegiana",
    description: "Berinjela empanada com molho e queijo",
    price: 15.99,
    category: "vegetariano",
    image: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=400&h=300&fit=crop"
  },
  {
    id: 18,
    name: "Omelete de legumes",
    description: "Omelete recheado com legumes frescos",
    price: 13.99,
    category: "vegetariano",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop"
  }
];

const guarnicoes = [
  "Arroz",
  "Arroz Integral",
  "Feijão",
  "Feijão Tropeiro",
  "Purê",
  "Batata Frita",
  "Farofa",
  "Salada"
];

// Função para formatar valores em reais
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
const formatCurrency = formatarMoeda;

function gerarIdPedido() {
  return 'RS' + Date.now().toString(36).toUpperCase();
}

// Gerenciamento de carrinho de compras
function obterCarrinho() {
  const carrinho = localStorage.getItem('restaurante_cart');
  return carrinho ? JSON.parse(carrinho) : [];
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('restaurante_cart', JSON.stringify(carrinho));
  atualizarContadorCarrinho();
}

function atualizarContadorCarrinho() {
  const carrinho = obterCarrinho();
  const quantidade = carrinho.reduce((soma, item) => soma + item.quantity, 0);
  const elementosContador = document.querySelectorAll('#cartCount, .cart-count');
  elementosContador.forEach(el => {
    if (el) el.textContent = quantidade;
  });
}

function limparCarrinho() {
  localStorage.removeItem('restaurante_cart');
  atualizarContadorCarrinho();
}

const getCart = obterCarrinho;
const saveCart = salvarCarrinho;
const updateCartCount = atualizarContadorCarrinho;
const clearCart = limparCarrinho;

// Gerenciamento de pedidos
function obterPedidos() {
  const pedidos = localStorage.getItem('restaurante_orders');
  return pedidos ? JSON.parse(pedidos) : [];
}

function salvarPedido(pedido) {
  const pedidos = obterPedidos();
  pedidos.unshift(pedido);
  localStorage.setItem('restaurante_orders', JSON.stringify(pedidos));
}

function atualizarStatusPedido(pedidoId, status) {
  const pedidos = obterPedidos();
  const indice = pedidos.findIndex(p => p.id === pedidoId);
  if (indice !== -1) {
    pedidos[indice].status = status;
    pedidos[indice].updatedAt = new Date().toISOString();
    localStorage.setItem('restaurante_orders', JSON.stringify(pedidos));
  }
}

const getOrders = obterPedidos;
const saveOrder = salvarPedido;
const updateOrderStatus = atualizarStatusPedido;

// Gerenciamento de produtos para o painel administrativo
function obterProdutos() {
  const armazenados = localStorage.getItem('restaurante_products');
  if (armazenados) {
    return JSON.parse(armazenados);
  }
  return produtos;
}

function salvarProdutos(listaProdutos) {
  localStorage.setItem('restaurante_products', JSON.stringify(listaProdutos));
}

function adicionarProduto(produto) {
  const listaProdutos = obterProdutos();
  produto.id = Date.now();
  listaProdutos.push(produto);
  salvarProdutos(listaProdutos);
}

function atualizarProduto(produtoId, atualizacoes) {
  const listaProdutos = obterProdutos();
  const indice = listaProdutos.findIndex(p => p.id === produtoId);
  if (indice !== -1) {
    listaProdutos[indice] = { ...listaProdutos[indice], ...atualizacoes };
    salvarProdutos(listaProdutos);
  }
}

function excluirProduto(produtoId) {
  const listaProdutos = obterProdutos();
  const filtrados = listaProdutos.filter(p => p.id !== produtoId);
  salvarProdutos(filtrados);
}

const getProducts = obterProdutos;
const saveProducts = salvarProdutos;
const addProduct = adicionarProduto;
const updateProduct = atualizarProduto;
const deleteProduct = excluirProduto;
const products = produtos;
const garnishes = guarnicoes;
