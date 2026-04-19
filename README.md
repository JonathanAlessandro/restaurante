# Restaurante Web

Aplicativo web para pedido de marmitas online, desenvolvido com HTML, CSS e JavaScript. Permite aos usuários navegar por um catálogo de marmitas, adicionar itens ao carrinho, visualizar detalhes em modais e finalizar pedidos com coleta de dados pessoais e endereço.

## Funcionamento

### Página Inicial (`index.html`)
- **Catálogo de Produtos**: Exibe marmitas organizadas por categorias (Carnes, Frangos, Peixes, Vegetarianos, Especiais).
- **Filtros**: Botões para filtrar produtos por categoria.
- **Modal de Produto**: Ao clicar em uma marmita, abre um modal com detalhes, opções de guarnição, quantidade e botão para adicionar ao carrinho.
- **Carrinho**: Barra lateral (desktop) ou modal (mobile) mostrando itens adicionados, total e botão para finalizar pedido.
- **Localização**: Botão para obter endereço automaticamente via geolocalização.

### Páginas Secundárias
- **Carrinho (`pages/cart.html`)**: Lista detalhada dos itens, permite ajustar quantidades, remover itens e ir para checkout.
- **Checkout (`pages/checkout.html`)**: Formulário para dados pessoais, endereço, método de entrega/pagamento e resumo do pedido.
- **Sucesso (`pages/success.html`)**: Confirmação do pedido realizado.

### Painel Administrativo (`admin/`)
- **Dashboard (`admin/index.html`)**: Visão geral com estatísticas de pedidos e vendas.
- **Pedidos (`admin/orders.html`)**: Lista de pedidos com filtros por status, visualização de detalhes e alteração de status.
- **Produtos (`admin/products.html`)**: Gerenciamento de produtos (adicionar, editar, excluir, pausar/ativar).

## Tecnologias
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python (Flask) - em desenvolvimento
- **Armazenamento**: LocalStorage para carrinho e dados temporários
- **APIs**: Nominatim para geolocalização

## Estrutura de Arquivos
```
restaurante-main/
├── index.html                 # Página principal
├── backend.py                 # Servidor backend (pendente)
├── requirements.txt           # Dependências Python
├── data/marmitas.json         # Dados dos produtos
├── js/                        # Scripts JavaScript
│   ├── app.js                 # Inicialização da app
│   ├── CartManager.js         # Gerenciamento do carrinho
│   ├── ModalManager.js        # Modais de produto
│   ├── ProductCatalog.js      # Catálogo de produtos
│   ├── data.js                # Dados e utilitários
│   ├── cart.js                # Página do carrinho
│   ├── checkout.js            # Página de checkout
│   ├── admin.js               # Dashboard admin
│   ├── orders.js              # Gerenciamento de pedidos
│   └── products.js            # Gerenciamento de produtos
├── css/                       # Estilos CSS
├── pages/                     # Páginas secundárias
├── admin/                     # Painel administrativo
└── img/                       # Imagens
```

## Como Executar
1. Clone o repositório: `git clone https://github.com/JonathanAlessandro/restaurante.git`
2. Abra `index.html` em um navegador web.
3. Para o backend: Instale dependências com `pip install -r requirements.txt` e execute `python backend.py`.

## Pendências para Conclusão
- **Integração com Backend**: Conectar frontend ao servidor Python para salvar pedidos e gerenciar dados persistentemente.
- **Autenticação**: Implementar login para painel admin.
- **Pagamentos**: Integrar gateway de pagamento (PIX, cartão).
- **Notificações**: Sistema de notificações para novos pedidos.
- **Testes**: Validar compatibilidade entre scripts legados e novos, testar funcionalidades em diferentes navegadores.
- **Deploy**: Configurar hospedagem e CI/CD.
- **Responsividade**: Ajustes finais para dispositivos móveis.
- **Segurança**: Validação de dados e proteção contra XSS/CSRF.
{
  "cliente": {
    "nome": "João Silva",
    "telefone": "(11) 99999-9999",
    "endereco": "Rua das Flores, 123 - Centro, São Paulo"
  },
  "itens": [
    {
      "id": 1,
      "nome": "Marmita Fit",
      "preco": 15.99,
      "quantidade": 2,
      "imagem": "img/marmita1.jpg"
    }
  ],
  "total": 31.98
}
```

### Como Executar o Backend
1. Instale as dependências:
```bash
pip install -r requirements.txt
```

2. Execute o servidor:
```bash
python backend.py
```

3. O backend ficará disponível em `http://localhost:5000`

### Endpoints da API
- `POST /api/pedidos` - Criar novo pedido
- `GET /api/pedidos` - Listar todos os pedidos
- `GET /api/pedidos/<id>` - Obter pedido específico

### Próximos Passos para o Backend
- **Banco de Dados**: Substitua a lista `pedidos` por um banco real (SQLite, PostgreSQL, etc.)
- **Autenticação**: Adicione sistema de login para admin
- **Pagamentos**: Integre com gateways de pagamento
- **Notificações**: Implemente envio de emails/SMS
- **Admin Panel**: Crie interface para gerenciar pedidos