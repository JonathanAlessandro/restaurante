class GerenciadorCarrinho {
  constructor() {
    this.carrinho = [];
    this.sacolaItensContainers = document.querySelectorAll('.sacola-itens');
    this.totalSacolaElement = document.getElementById('total-sacola');
    this.cartCountElement = document.getElementById('cartCount');
    this.emptyMessageElements = document.querySelectorAll('.sacola-vazia');
    this.clearCartButtons = document.querySelectorAll('#limpar-sacola, .limpar-sacola');
    this.vincularAcoesLimpar();
  }

  vincularAcoesLimpar() {
    this.clearCartButtons.forEach(botao => {
      botao.addEventListener('click', () => this.limparCarrinho());
    });
  }

  adicionarItem(produto, quantidade) {
    const itemExistente = this.carrinho.find(i => i.id === produto.id);
    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      this.carrinho.push({ ...produto, quantidade });
    }
    this.atualizarUICarrinho();
    this.mostrarNotificacao('Pedido adicionado!');
  }

  atualizarUICarrinho() {
    this.sacolaItensContainers.forEach(container => {
      container.innerHTML = '';
    });

    let total = 0;

    this.carrinho.forEach(item => {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;
      this.sacolaItensContainers.forEach(container => {
        container.insertAdjacentHTML('beforeend', `
          <div class="item-sacola">
            <span>${item.nome} x${item.quantidade}</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
          </div>
        `);
      });
    });

    if (this.totalSacolaElement) {
      this.totalSacolaElement.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    if (this.cartCountElement) {
      this.cartCountElement.textContent = this.carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    }

    this.atualizarEstadoVazio();
  }

  atualizarEstadoVazio() {
    const temItens = this.carrinho.length > 0;
    this.emptyMessageElements.forEach(elemento => {
      elemento.style.display = temItens ? 'none' : 'block';
    });
  }

  abrirCarrinhoMobile() {
    const modal = document.getElementById('modalSacolaMobile');
    if (!modal) return;
    if (window.innerWidth <= 748 || window.innerHeight <= 867) {
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }
  }

  fecharCarrinhoMobile() {
    const modal = document.getElementById('modalSacolaMobile');
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  limparCarrinho() {
    this.carrinho = [];
    this.atualizarUICarrinho();
    this.mostrarNotificacao('Carrinho limpo!');
  }

  mostrarNotificacao(texto) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = texto;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }
}

const CartManager = GerenciadorCarrinho;
