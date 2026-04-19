// Lógica da página de pedidos do admin
let filtroStatusAtual = 'all';
let termoBuscaAtual = '';
let pedidoAtual = null;

function obterPedidos() {
  return [
    {
      id: '1',
      cliente: { nome: 'John Doe', telefone: '123456789' },
      items: [{ name: 'Item 1', quantity: 2 }],
      total: 100,
      status: 'pending',
      createdAt: new Date(),
      delivery: { method: 'delivery', address: { street: 'Rua A', number: '100', neighborhood: 'Bairro B' } },
      payment: { method: 'pix', change: 50 },
      subtotal: 90,
      deliveryFee: 10
    }
  ];
}

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

function atualizarStatusPedido(pedidoId, status) {
  console.log(`Pedido ${pedidoId} atualizado para ${status}`);
}

document.addEventListener('DOMContentLoaded', function() {
  renderizarPedidos();
});

function renderizarPedidos() {
  let pedidos = obterPedidos();

  if (filtroStatusAtual !== 'all') {
    pedidos = pedidos.filter(pedido => pedido.status === filtroStatusAtual);
  }

  if (termoBuscaAtual) {
    const termo = termoBuscaAtual.toLowerCase();
    pedidos = pedidos.filter(pedido =>
      pedido.id.toLowerCase().includes(termo) ||
      pedido.cliente.nome.toLowerCase().includes(termo)
    );
  }

  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  if (pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--gray-400);">
          Nenhum pedido encontrado
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pedidos.map(pedido => `
    <tr>
      <td><span class="order-id">#${pedido.id}</span></td>
      <td>
        <div>${pedido.cliente.nome}</div>
        <div style="font-size: 12px; color: var(--gray-500);">${pedido.cliente.telefone}</div>
      </td>
      <td>${pedido.items.length} item(s)</td>
      <td>${formatarMoeda(pedido.total)}</td>
      <td>
        <select class="status-select" style="width: auto; padding: 4px 8px;" onchange="alterarStatusPedido('${pedido.id}', this.value)">
          <option value="pending" ${pedido.status === 'pending' ? 'selected' : ''}>Pendente</option>
          <option value="preparing" ${pedido.status === 'preparing' ? 'selected' : ''}>Preparando</option>
          <option value="ready" ${pedido.status === 'ready' ? 'selected' : ''}>Pronto</option>
          <option value="delivered" ${pedido.status === 'delivered' ? 'selected' : ''}>Entregue</option>
          <option value="cancelled" ${pedido.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
        </select>
      </td>
      <td>${formatarData(pedido.createdAt)}</td>
      <td>
        <div class="actions-cell">
          <button class="action-btn" onclick="verPedido('${pedido.id}')" title="Ver detalhes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          <button class="action-btn" onclick="verPedido('${pedido.id}'); setTimeout(imprimirPedido, 100);" title="Imprimir comanda">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filtrarPedidos(status, botao) {
  filtroStatusAtual = status;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  botao.classList.add('active');
  renderizarPedidos();
}

function buscarPedidos(termo) {
  termoBuscaAtual = termo;
  renderizarPedidos();
}

function alterarStatusPedido(pedidoId, status) {
  atualizarStatusPedido(pedidoId, status);
  renderizarPedidos();
}

function verPedido(pedidoId) {
  const pedidos = obterPedidos();
  pedidoAtual = pedidos.find(p => p.id === pedidoId);
  if (!pedidoAtual) return;

  const modalBody = document.getElementById('orderModalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="order-detail-row">
      <span class="order-detail-label">Pedido</span>
      <span class="order-detail-value">#${pedidoAtual.id}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Cliente</span>
      <span class="order-detail-value">${pedidoAtual.cliente.nome}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Telefone</span>
      <span class="order-detail-value">${pedidoAtual.cliente.telefone}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Entrega</span>
      <span class="order-detail-value">${pedidoAtual.delivery.method === 'delivery' ? 'Entrega' : 'Retirada'}</span>
    </div>
    ${pedidoAtual.delivery.address ? `
    <div class="order-detail-row">
      <span class="order-detail-label">Endereço</span>
      <span class="order-detail-value">
        ${pedidoAtual.delivery.address.street}, ${pedidoAtual.delivery.address.number}
        ${pedidoAtual.delivery.address.complement ? ` - ${pedidoAtual.delivery.address.complement}` : ''}
        <br>${pedidoAtual.delivery.address.neighborhood}
      </span>
    </div>
    ` : ''}
    <div class="order-detail-row">
      <span class="order-detail-label">Pagamento</span>
      <span class="order-detail-value">${obterRotuloPagamento(pedidoAtual.payment.method)}</span>
    </div>
    ${pedidoAtual.payment.change ? `
    <div class="order-detail-row">
      <span class="order-detail-label">Troco para</span>
      <span class="order-detail-value">${pedidoAtual.payment.change}</span>
    </div>
    ` : ''}

    <h3 style="margin: 20px 0 12px; font-size: 14px; font-weight: 600;">Itens do Pedido</h3>
    <div class="order-items-list">
      ${pedidoAtual.items.map(item => `
        <div class="order-item-row">
          <span>
            <strong>${item.quantity}x</strong> ${item.name}
            <br><small style="color: var(--gray-500);">Guarnicao: ${item.garnish}</small>
            ${item.observations ? `<br><small style="color: var(--gray-500);">Obs: ${item.observations}</small>` : ''}
            ${item.cutlery > 0 ? `<br><small style="color: var(--gray-500);">Talheres: ${item.cutlery}</small>` : ''}
          </span>
          <span>${formatarMoeda(item.price * item.quantity)}</span>
        </div>
      `).join('')}
    </div>

    <div class="order-detail-row">
      <span class="order-detail-label">Subtotal</span>
      <span class="order-detail-value">${formatarMoeda(pedidoAtual.subtotal)}</span>
    </div>
    <div class="order-detail-row">
      <span class="order-detail-label">Taxa de entrega</span>
      <span class="order-detail-value">${pedidoAtual.deliveryFee > 0 ? formatarMoeda(pedidoAtual.deliveryFee) : 'Gratis'}</span>
    </div>
    <div class="order-detail-row" style="font-weight: 700;">
      <span>Total</span>
      <span>${formatarMoeda(pedidoAtual.total)}</span>
    </div>

    <div class="no-print">
      <label class="form-label" style="margin-top: 20px;">Alterar Status</label>
      <select class="status-select" id="modalStatusSelect" onchange="alterarStatusPedido('${pedidoAtual.id}', this.value)">
        <option value="pending" ${pedidoAtual.status === 'pending' ? 'selected' : ''}>Pendente</option>
        <option value="preparing" ${pedidoAtual.status === 'preparing' ? 'selected' : ''}>Preparando</option>
        <option value="ready" ${pedidoAtual.status === 'ready' ? 'selected' : ''}>Pronto</option>
        <option value="delivered" ${pedidoAtual.status === 'delivered' ? 'selected' : ''}>Entregue</option>
        <option value="cancelled" ${pedidoAtual.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
      </select>
    </div>
  `;

  document.getElementById('orderModal')?.classList.add('active');
}

function fecharModalPedido() {
  document.getElementById('orderModal')?.classList.remove('active');
  pedidoAtual = null;
}

function imprimirPedido() {
  window.print();
}

function obterRotuloPagamento(metodo) {
  const labels = {
    pix: 'PIX',
    credit: 'Cartão de Crédito',
    debit: 'Cartão de Débito',
    cash: 'Dinheiro',
    voucher: 'Vale Refeição'
  };
  return labels[metodo] || metodo;
}

const getOrders = obterPedidos;
const updateOrderStatus = atualizarStatusPedido;
const renderOrders = renderizarPedidos;
const filterOrders = filtrarPedidos;
const searchOrders = buscarPedidos;
const changeOrderStatus = alterarStatusPedido;
const viewOrder = verPedido;
const closeOrderModal = fecharModalPedido;
const printOrder = imprimirPedido;
const getPaymentLabel = obterRotuloPagamento;
