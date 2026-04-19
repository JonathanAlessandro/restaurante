// Lógica da página do carrinho
// Este script exibe os itens que estão no carrinho e permite ajustá-los.
document.addEventListener('DOMContentLoaded', function() {
  renderizarCarrinho();
  atualizarContadorCarrinho();
});

function renderizarCarrinho() {
  const carrinho = obterCarrinho();
  const container = document.getElementById('cartContent');

  if (!container) return;

  if (carrinho.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h2>Seu carrinho está vazio</h2>
        <p>Adicione deliciosas marmitas ao seu pedido</p>
        <a href="index.html" class="btn-primary">Ver Cardápio</a>
      </div>
    `;
    return;
  }

  const subtotal = carrinho.reduce((soma, item) => soma + (item.price * item.quantity), 0);
  const taxaEntrega = 5.00;
  const total = subtotal + taxaEntrega;

  container.innerHTML = `
    <div class="cart-items">
      ${carrinho.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://placehold.co/80x80/f3f4f6/9ca3af?text=Sem'">
          <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-garnish">Guarnição: ${item.garnish}${item.cutlery > 0 ? ` | ${item.cutlery} talher(es)` : ''}</p>
            ${item.observations ? `<p class="cart-item-garnish">Obs: ${item.observations}</p>` : ''}
            <span class="cart-item-price">${formatarMoeda(item.price * item.quantity)}</span>
          </div>
          <div class="cart-item-actions">
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <div class="qty-controls">
              <button class="qty-btn" onclick="updateItemQty(${item.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="updateItemQty(${item.id}, 1)">+</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="cart-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${formatarMoeda(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Taxa de entrega</span>
        <span>${formatarMoeda(taxaEntrega)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>${formatarMoeda(total)}</span>
      </div>
      <button class="checkout-btn" onclick="goToCheckout()">
        Finalizar Pedido
      </button>
    </div>
  `;
}

function removerDoCarrinho(itemId) {
  let carrinho = obterCarrinho();
  carrinho = carrinho.filter(item => item.id !== itemId);
  salvarCarrinho(carrinho);
  renderizarCarrinho();
}

function atualizarQuantidadeItem(itemId, delta) {
  let carrinho = obterCarrinho();
  const item = carrinho.find(i => i.id === itemId);

  if (item) {
    item.quantity = Math.max(1, item.quantity + delta);
    salvarCarrinho(carrinho);
    renderizarCarrinho();
  }
}

function irParaCheckout() {
  window.location.href = 'checkout.html';
}

function formatarMoeda(amount) {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarContadorCarrinho() {
  const carrinho = obterCarrinho();
  const quantidade = carrinho.reduce((soma, item) => soma + item.quantity, 0);
  const elementosContador = document.querySelectorAll('#cartCount, .cart-count');
  elementosContador.forEach(el => {
    if (el) el.textContent = quantidade;
  });
}

const removeFromCart = removerDoCarrinho;
const updateItemQty = atualizarQuantidadeItem;
const goToCheckout = irParaCheckout;
const getCart = obterCarrinho;
const saveCart = salvarCarrinho;
const formatCurrency = formatarMoeda;
const updateCartCount = atualizarContadorCarrinho;
