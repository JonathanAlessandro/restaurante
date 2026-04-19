// Lógica da página de checkout
// Este arquivo controla o resumo do pedido, seleção de tipo de entrega e pagamento.
let metodoEntrega = 'delivery';
let metodoPagamento = 'pix';

document.addEventListener('DOMContentLoaded', function() {
  const carrinho = obterCarrinho();

  if (carrinho.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderizarResumoPedido();
  configurarMascaraTelefone();
  configurarMascaraCep();
});

function obterCarrinho() {
  if (typeof window.obterCarrinho === 'function') {
    return window.obterCarrinho();
  }
  if (typeof window.getCart === 'function') {
    return window.getCart();
  }
  return [];
}

function formatarMoeda(amount) {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function gerarIdPedido() {
  if (typeof window.gerarIdPedido === 'function') {
    return window.gerarIdPedido();
  }
  return 'RS' + Date.now().toString(36).toUpperCase();
}

function salvarPedido(pedido) {
  if (typeof window.salvarPedido === 'function') {
    window.salvarPedido(pedido);
    return;
  }
  console.log('Pedido salvo:', pedido);
}

function limparCarrinho() {
  if (typeof window.limparCarrinho === 'function') {
    window.limparCarrinho();
    return;
  }
  if (typeof window.clearCart === 'function') {
    window.clearCart();
  }
}

function renderizarResumoPedido() {
  const carrinho = obterCarrinho();
  const itensContainer = document.getElementById('orderItems');

  if (!itensContainer) return;

  itensContainer.innerHTML = carrinho.map(item => `
    <div class="order-item">
      <div class="order-item-info">
        <span class="order-item-qty">${item.quantity}x</span>
        <div>
          <span class="order-item-name">${item.name}</span>
          <p class="order-item-garnish">Guarnição: ${item.garnish}</p>
        </div>
      </div>
      <span class="order-item-price">${formatarMoeda(item.price * item.quantity)}</span>
    </div>
  `).join('');

  atualizarTotais();
}

function atualizarTotais() {
  const carrinho = obterCarrinho();
  const subtotal = carrinho.reduce((soma, item) => soma + (item.price * item.quantity), 0);
  const taxaEntrega = metodoEntrega === 'delivery' ? 5.00 : 0;
  const total = subtotal + taxaEntrega;

  const subtotalEl = document.getElementById('subtotal');
  const deliveryFeeEl = document.getElementById('deliveryFee');
  const totalEl = document.getElementById('total');

  if (subtotalEl) subtotalEl.textContent = formatarMoeda(subtotal);
  if (deliveryFeeEl) deliveryFeeEl.textContent = taxaEntrega > 0 ? formatarMoeda(taxaEntrega) : 'Grátis';
  if (totalEl) totalEl.textContent = formatarMoeda(total);
}

function selecionarEntrega(method) {
  metodoEntrega = method;

  document.querySelectorAll('#deliveryOptions .radio-option').forEach(opt => {
    opt.classList.remove('selected');
    const input = opt.querySelector('input');
    if (input && input.value === method) {
      opt.classList.add('selected');
      input.checked = true;
    }
  });

  const addressSection = document.getElementById('addressSection');
  if (addressSection) {
    addressSection.style.display = method === 'delivery' ? 'block' : 'none';
  }

  atualizarTotais();
}

function selecionarPagamento(method) {
  metodoPagamento = method;

  document.querySelectorAll('#paymentOptions .radio-option').forEach(opt => {
    opt.classList.remove('selected');
    const input = opt.querySelector('input');
    if (input && input.value === method) {
      opt.classList.add('selected');
      input.checked = true;
    }
  });

  const changeSection = document.getElementById('changeSection');
  if (changeSection) {
    changeSection.style.display = method === 'cash' ? 'block' : 'none';
  }
}

function configurarMascaraTelefone() {
  const telefoneInput = document.getElementById('customerPhone');
  if (!telefoneInput) return;

  telefoneInput.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);

    if (valor.length > 6) {
      valor = `(${valor.slice(0,2)}) ${valor.slice(2,7)}-${valor.slice(7)}`;
    } else if (valor.length > 2) {
      valor = `(${valor.slice(0,2)}) ${valor.slice(2)}`;
    } else if (valor.length > 0) {
      valor = `(${valor}`;
    }

    e.target.value = valor;
  });
}

function configurarMascaraCep() {
  const cepInput = document.getElementById('cep');
  if (!cepInput) return;

  cepInput.addEventListener('input', function(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);

    if (valor.length > 5) {
      valor = `${valor.slice(0,5)}-${valor.slice(5)}`;
    }

    e.target.value = valor;
  });
}

function validarFormulario() {
  const nome = document.getElementById('customerName')?.value.trim();
  const telefone = document.getElementById('customerPhone')?.value.trim();

  if (!nome) {
    alert('Por favor, informe seu nome');
    return false;
  }

  if (!telefone || telefone.length < 14) {
    alert('Por favor, informe um telefone válido');
    return false;
  }

  if (metodoEntrega === 'delivery') {
    const rua = document.getElementById('street')?.value.trim();
    const numero = document.getElementById('number')?.value.trim();
    const bairro = document.getElementById('neighborhood')?.value.trim();

    if (!rua || !numero || !bairro) {
      alert('Por favor, preencha o endereço completo');
      return false;
    }
  }

  return true;
}

function realizarPedido() {
  if (!validarFormulario()) return;

  const carrinho = obterCarrinho();
  const subtotal = carrinho.reduce((soma, item) => soma + (item.price * item.quantity), 0);
  const taxaEntrega = metodoEntrega === 'delivery' ? 5.00 : 0;
  const total = subtotal + taxaEntrega;

  const pedido = {
    id: gerarIdPedido(),
    cliente: {
      nome: document.getElementById('customerName')?.value.trim(),
      telefone: document.getElementById('customerPhone')?.value.trim()
    },
    entrega: {
      metodo: metodoEntrega,
      endereco: metodoEntrega === 'delivery' ? {
        cep: document.getElementById('cep')?.value.trim(),
        rua: document.getElementById('street')?.value.trim(),
        numero: document.getElementById('number')?.value.trim(),
        complemento: document.getElementById('complement')?.value.trim(),
        bairro: document.getElementById('neighborhood')?.value.trim()
      } : null
    },
    pagamento: {
      metodo: metodoPagamento,
      troco: metodoPagamento === 'cash' ? document.getElementById('changeAmount')?.value.trim() : null
    },
    itens: carrinho,
    subtotal: subtotal,
    taxaEntrega: taxaEntrega,
    total: total,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  salvarPedido(pedido);
  limparCarrinho();
  window.location.href = `success.html?order=${pedido.id}`;
}

const getCart = obterCarrinho;
const saveOrder = salvarPedido;
const clearCart = limparCarrinho;
const placeOrder = realizarPedido;
const selectDelivery = selecionarEntrega;
const selectPayment = selecionarPagamento;
