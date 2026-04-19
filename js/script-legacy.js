class MarmitaApp {
    constructor() {
        this.jsonUrl = 'marmitas.json';
        this.produtosData = [];
        this.carrinho = [];
        this.sectionsContainer = document.getElementById('produtos-secoes');
        this.modalContainer = document.getElementById('modais-container');

        this.init();
    }

    init() {
        this.loadProdutos();
        this.bindCategoriaFiltro();
    }

    async loadProdutos() {
        const response = await fetch(this.jsonUrl);
        this.produtosData = await response.json();
        this.createElementsFromData();
        this.initModalHandlers();
    }

    bindCategoriaFiltro() {
        document.querySelectorAll('.item-categoria').forEach(cat => {
            cat.addEventListener('click', e => {
                e.preventDefault();
                const categoria = cat.dataset.categoria;

                document.querySelectorAll('.cartao-produto').forEach(prod => {
                    prod.style.display =
                        !categoria || prod.dataset.categoria === categoria
                            ? 'block'
                            : 'none';
                });

                document.getElementById('produtos-container')
                    ?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    createElementsFromData() {
        const categoryOrder = ['frangos', 'carnes', 'especiais', 'super', 'outros'];
        const categoryLabels = {
            frangos: 'Frangos',
            carnes: 'Carnes',
            especiais: 'Especiais',
            super: 'Super Pratos',
            outros: 'Outros'
        };

        const productsByCategory = this.produtosData.reduce((acc, produto) => {
            const categoria = produto.categoria || 'outros';
            acc[categoria] = acc[categoria] || [];
            acc[categoria].push(produto);
            return acc;
        }, {});

        categoryOrder.forEach(categoria => {
            if (!productsByCategory[categoria]) return;

            const produtos = productsByCategory[categoria];
            const label = categoryLabels[categoria] || categoria;

            this.sectionsContainer.insertAdjacentHTML('beforeend', `
                <div class="lista-opcoes-wrapper">
                    <h2>${label}</h2>
                    <div class="lista-opcoes">
                        <div class="menu-especiais">
                            <div class="titulo-secao-especiais"></div>
                            <div class="lista-cartoes">
                                ${produtos.map(produto => {
                                    const preco = produto.preco.toFixed(2).replace('.', ',');
                                    return `
                                        <a href="#" class="cartao-produto" data-categoria="${produto.categoria}" data-modal-target="modal-${produto.id}">
                                            <div class="imagem-quadrada">
                                                <img src="${produto.imagem}" alt="${produto.nome}">
                                            </div>
                                            <p class="marca">${produto.marca}</p>
                                            <p class="nome-produto">${produto.nome}</p>
                                            <div class="box-preco">
                                                <span class="preco">R$ ${preco}</span>
                                            </div>
                                        </a>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });

        this.produtosData.forEach(produto => {
            this.modalContainer.insertAdjacentHTML('beforeend', `
                <div id="modal-${produto.id}" class="modal">
                    <div class="modal-content">
                        <span class="close-btn">&times;</span>
                        <div class="modal-body-content"></div>
                    </div>
                </div>
            `);
        });
    }

    initModalHandlers() {
        document.addEventListener('click', e => {
            const trigger = e.target.closest('[data-modal-target]');
            if (!trigger) return;

            e.preventDefault();
            const modalId = trigger.dataset.modalTarget;
            const produtoId = +modalId.split('-')[1];
            const produto = this.produtosData.find(p => p.id === produtoId);
            const modal = document.getElementById(modalId);

            this.populateModalContent(modal, produto);
            modal.classList.add('show');
        });

        document.addEventListener('click', e => {
            if (e.target.classList.contains('close-btn') ||
                e.target.classList.contains('modal')) {
                e.target.closest('.modal')?.classList.remove('show');
            }
        });
    }

    populateModalContent(modal, produto) {
        const body = modal.querySelector('.modal-body-content');
        const preco = produto.preco.toFixed(2).replace('.', ',');

        let quantidade = 0;

        const ingredientesHTML = produto.ingredientes && produto.ingredientes.length
            ? produto.ingredientes.map(i => `<li>${i}</li>`).join('')
            : '<li>Informação não disponível</li>';

        body.innerHTML = `
            <div class="modal-produto">
                <img src="${produto.imagem}" class="modal-header-img">
                <div class="modal-content-inner">
                    <h3 class="modal-marca">${produto.marca}</h3>
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

        mais.onclick = () => {
            quantidade++;
            qtdEl.textContent = quantidade;
            menos.disabled = false;
        };

        menos.onclick = () => {
            if (quantidade > 0) quantidade--;
            qtdEl.textContent = quantidade;
            menos.disabled = quantidade === 0;
        };

        body.querySelector('.add-to-cart').onclick = () => {
            if (quantidade === 0) {
                alert('Selecione a quantidade');
                return;
            }

            this.adicionarAoCarrinho(produto, quantidade);
            this.showToast('Pedido adicionado!');
            modal.classList.remove('show');
        };
    }

    adicionarAoCarrinho(produto, quantidade) {
        const item = this.carrinho.find(i => i.id === produto.id);
        item ? item.quantidade += quantidade : this.carrinho.push({ ...produto, quantidade });
        this.atualizarCarrinho();
    }

    atualizarCarrinho() {
        document.querySelectorAll('.sacola-itens').forEach(c => c.innerHTML = '');
        let total = 0;

        this.carrinho.forEach(item => {
            const sub = item.preco * item.quantidade;
            total += sub;

            document.querySelectorAll('.sacola-itens').forEach(c =>
                c.insertAdjacentHTML('beforeend', `
                    <div class="item-sacola">
                        <span>${item.nome} x${item.quantidade}</span>
                        <span>R$ ${sub.toFixed(2)}</span>
                    </div>
                `)
            );
        });

        document.getElementById('total-sacola').textContent = `Total: R$ ${total.toFixed(2)}`;
        document.getElementById('cartCount').textContent =
            this.carrinho.reduce((s, i) => s + i.quantidade, 0);
    }

    showToast(texto) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = texto;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2000);
    }

    goToCart() {
        const modal = document.getElementById('modalSacolaMobile');

        if (window.innerWidth <= 748 || window.innerHeight <= 867) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileCart() {
        const modal = document.getElementById('modalSacolaMobile');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    obterLocalizacao() {
        const status = document.getElementById('statusLocalizacao');
        const inputEndereco = document.getElementById('enderecoManual');

        if (!navigator.geolocation) {
            status.innerHTML = "Geolocalização não suportada.";
            return;
        }

        status.innerHTML = "Buscando coordenadas...";

        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            status.innerHTML = "Convertendo para endereço...";

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await response.json();

                if (data.address) {
                    const rua = data.address.road || "";
                    const numero = data.address.house_number || "S/N";
                    const bairro = data.address.suburb || data.address.neighbourhood || "";
                    const cidade = data.address.city || data.address.town || "";
                    const enderecoCompleto = `${rua}, ${numero} - ${bairro}, ${cidade}`;

                    inputEndereco.value = enderecoCompleto;
                    status.innerHTML = "Endereço preenchido!";
                    status.style.color = "green";
                } else {
                    status.innerHTML = "Endereço não encontrado, digite manualmente.";
                }
            } catch (error) {
                console.error(error);
                status.innerHTML = "Erro ao buscar endereço. Digite manualmente.";
                inputEndereco.value = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
            }
        }, (error) => {
            status.innerHTML = "Erro: " + error.message;
            status.style.color = "red";
        });
    }
}

let appInstance;

document.addEventListener('DOMContentLoaded', () => {
    appInstance = new MarmitaApp();
    window.goToCart = appInstance.goToCart.bind(appInstance);
    window.closeMobileCart = appInstance.closeMobileCart.bind(appInstance);
    window.obterLocalizacao = appInstance.obterLocalizacao.bind(appInstance);
});

