// Funções comuns do painel administrativo
// Aqui estão as funções que exibem dados de pedidos e controlam a interface do admin.

function obterPedidos() {
  return [
    { id: 1, cliente: { nome: 'John Doe' }, total: 100, status: 'pending', createdAt: '2023-10-01T10:00:00' },
    { id: 2, cliente: { nome: 'Jane Smith' }, total: 200, status: 'preparing', createdAt: '2023-10-02T11:00:00' }
  ];
}

function formatarMoeda(valor) {
  return `R$ ${valor.toFixed(2)}`;
}

function alternarBarraLateral() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (!sidebar || !overlay) return;

  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

document.addEventListener('click', function(e) {
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.querySelector('.mobile-menu-btn');

  if (sidebar && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target) && menuBtn && !menuBtn.contains(e.target)) {
      alternarBarraLateral();
    }
  }
});

function atualizarEstatisticasPainel() {
  const pedidos = obterPedidos();

  const totalPedidos = pedidos.length;
  const vendasTotais = pedidos.reduce((soma, pedido) => soma + pedido.total, 0);
  const pedidosPendentes = pedidos.filter(pedido => pedido.status === 'pending').length;
  const pedidosEmPreparo = pedidos.filter(pedido => pedido.status === 'preparing').length;

  const totalPedidosEl = document.getElementById('totalOrders');
  const vendasTotaisEl = document.getElementById('totalSales');
  const pedidosPendentesEl = document.getElementById('pendingOrders');
  const pedidosEmPreparoEl = document.getElementById('preparingOrders');

  if (totalPedidosEl) totalPedidosEl.textContent = totalPedidos;
  if (vendasTotaisEl) vendasTotaisEl.textContent = formatarMoeda(vendasTotais);
  if (pedidosPendentesEl) pedidosPendentesEl.textContent = pedidosPendentes;
  if (pedidosEmPreparoEl) pedidosEmPreparoEl.textContent = pedidosEmPreparo;
}

function renderizarPedidosRecentes() {
  const pedidos = obterPedidos().slice(0, 5);
  const tbody = document.getElementById('recentOrdersBody');

  if (!tbody) return;

  if (pedidos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px; color: var(--gray-400);">
          Nenhum pedido ainda
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pedidos.map(pedido => `
    <tr>
      <td><span class="order-id">#${pedido.id}</span></td>
      <td>${pedido.cliente.nome}</td>
      <td>${formatarMoeda(pedido.total)}</td>
      <td><span class="status-badge status-${pedido.status}">${obterRotuloStatus(pedido.status)}</span></td>
      <td>${formatarData(pedido.createdAt)}</td>
    </tr>
  `).join('');
}

function obterRotuloStatus(status) {
  const labels = {
    pending: 'Pendente',
    preparing: 'Preparando',
    ready: 'Pronto',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  };
  return labels[status] || status;
}

function formatarData(dataString) {
  const date = new Date(dataString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function renderizarGrafico() {
  const canvas = document.getElementById('chartCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const pedidos = obterPedidos();
  const dias = [];
  const valores = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const diaTexto = date.toLocaleDateString('pt-BR', { weekday: 'short' });
    dias.push(diaTexto);

    const inicioDia = new Date(date.setHours(0, 0, 0, 0));
    const fimDia = new Date(date.setHours(23, 59, 59, 999));

    const vendasDia = pedidos
      .filter(pedido => {
        const dataPedido = new Date(pedido.createdAt);
        return dataPedido >= inicioDia && dataPedido <= fimDia;
      })
      .reduce((soma, pedido) => soma + pedido.total, 0);

    valores.push(vendasDia);
  }

  const largura = canvas.width = canvas.offsetWidth;
  const altura = canvas.height = 200;

  ctx.clearRect(0, 0, largura, altura);

  const maxValor = Math.max(...valores, 100);
  const padding = 40;
  const larguraGrafico = largura - padding * 2;
  const alturaGrafico = altura - padding * 2;
  const larguraBarra = larguraGrafico / dias.length - 10;

  valores.forEach((valor, i) => {
    const x = padding + i * (larguraGrafico / dias.length) + 5;
    const alturaBarra = (valor / maxValor) * alturaGrafico;
    const y = altura - padding - alturaBarra;

    ctx.fillStyle = '#F5C518';
    ctx.beginPath();
    ctx.roundRect(x, y, larguraBarra, alturaBarra, 4);
    ctx.fill();

    ctx.fillStyle = '#6b7280';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(dias[i], x + larguraBarra / 2, altura - 10);

    if (valor > 0) {
      ctx.fillStyle = '#1f2937';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(formatarMoeda(valor).replace('R$', ''), x + larguraBarra / 2, y - 5);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  atualizarEstatisticasPainel();
  renderizarPedidosRecentes();
  renderizarGrafico();
});

const getOrders = obterPedidos;
const formatCurrency = formatarMoeda;
const toggleSidebar = alternarBarraLateral;
const updateDashboardStats = atualizarEstatisticasPainel;
const renderRecentOrders = renderizarPedidosRecentes;
const getStatusLabel = obterRotuloStatus;
const formatDate = formatarData;
const renderChart = renderizarGrafico;
