# Documentação do Site Restaurante

## Visão Geral
Este é um site de restaurante online que permite aos usuários visualizar marmitas, adicionar itens ao carrinho, visualizar detalhes em modais e finalizar pedidos. O site é construído com HTML, CSS e JavaScript, utilizando uma arquitetura modular para melhor manutenção.

## Arquitetura
O site segue uma arquitetura modular baseada em classes JavaScript:
- **MarmitaApp**: Classe principal que orquestra a aplicação
- **ProductCatalog**: Gerencia o carregamento e renderização dos produtos
- **ModalManager**: Controla a abertura, fechamento e população dos modais
- **CartManager**: Gerencia o estado do carrinho de compras

## Estrutura de Arquivos
```
restaurante-main/
├── index.html                 # Página principal
├── data/
│   └── marmitas.json          # Dados dos produtos
├── js/
│   ├── app.js                 # Classe MarmitaApp e inicialização
│   ├── CartManager.js         # Gerenciamento do carrinho
│   ├── ModalManager.js        # Gerenciamento dos modais
│   └── ProductCatalog.js      # Catálogo de produtos
├── css/
│   ├── styles.css             # Arquivo principal que importa os módulos
│   ├── home-base.css          # Estilos base da página inicial
│   ├── home-modal.css         # Estilos dos modais
│   ├── home-cart.css          # Estilos do carrinho
│   └── home-responsive.css    # Estilos responsivos
└── img/                       # Imagens do site
```

## Classes e Funções

### MarmitaApp (js/app.js)
Classe principal que inicializa e coordena todos os componentes da aplicação.

#### Construtor
```javascript
constructor()
```
- Inicializa referências aos containers HTML
- Cria instâncias das classes auxiliares (ProductCatalog, CartManager, ModalManager)
- Passa callbacks para comunicação entre classes

#### init()
```javascript
async init()
```
- Carrega os produtos via ProductCatalog
- Inicializa o ModalManager
- Liga os filtros de categoria

#### bindCategoriaFiltro()
```javascript
bindCategoriaFiltro()
```
- Adiciona event listeners aos botões de categoria
- Filtra produtos por categoria ao clicar
- Faz scroll suave para a seção de produtos

#### bindGlobalActions()
```javascript
bindGlobalActions()
```
- Liga funções globais para o carrinho mobile
- Liga função de obtenção de localização

#### obterLocalizacao()
```javascript
obterLocalizacao()
```
- Usa geolocalização do navegador para obter coordenadas
- Converte coordenadas em endereço via Nominatim API
- Preenche automaticamente o campo de endereço

### ProductCatalog (js/ProductCatalog.js)
Gerencia o carregamento e exibição dos produtos.

#### Construtor
```javascript
constructor(jsonPath, sectionsContainer)
```
- Recebe caminho para o JSON e container onde renderizar

#### loadProdutos()
```javascript
async loadProdutos()
```
- Faz fetch do arquivo JSON
- Processa os dados dos produtos
- Chama renderSections() para exibir

#### renderSections()
```javascript
renderSections(sections)
```
- Cria seções HTML para cada categoria
- Renderiza cards de produto para cada item
- Adiciona data attributes para filtros

#### getProductById()
```javascript
getProductById(id)
```
- Busca produto por ID nos dados carregados
- Usado pelo ModalManager para popular modais

### ModalManager (js/ModalManager.js)
Controla a abertura, fechamento e conteúdo dos modais de produto.

#### Construtor
```javascript
constructor(modalContainer, getProductById, onAddToCart)
```
- Recebe container do modal e callbacks

#### init()
```javascript
init()
```
- Renderiza o shell HTML do modal
- Adiciona event listener global para cliques

#### renderModalShell()
```javascript
renderModalShell()
```
- Cria a estrutura HTML básica do modal
- Adiciona botão de fechar

#### handleDocumentClick()
```javascript
handleDocumentClick(event)
```
- Detecta cliques em elementos com data-modal-target
- Abre modal ou fecha ao clicar fora/botão fechar

#### openModal()
```javascript
openModal(productId)
```
- Obtém dados do produto via callback
- Popula conteúdo do modal
- Mostra o modal

#### closeModal()
```javascript
closeModal()
```
- Esconde o modal removendo classe 'show'

#### populateModalContent()
```javascript
populateModalContent(produto)
```
- Gera HTML dinâmico com detalhes do produto
- Adiciona controles de quantidade
- Liga eventos para botões de quantidade e adicionar ao carrinho

### CartManager (js/CartManager.js)
Gerencia o estado e interface do carrinho de compras.

#### Construtor
```javascript
constructor()
```
- Inicializa array do carrinho vazio
- Seleciona elementos DOM do carrinho
- Liga ações de limpar carrinho

#### bindClearActions()
```javascript
bindClearActions()
```
- Adiciona event listeners aos botões "Limpar"
- Chama clearCart() ao clicar

#### addItem()
```javascript
addItem(produto, quantidade)
```
- Adiciona ou incrementa item no carrinho
- Atualiza interface
- Mostra toast de confirmação

#### updateCartUI()
```javascript
updateCartUI()
```
- Limpa containers de itens
- Renderiza HTML para cada item do carrinho
- Atualiza total e contador
- Atualiza estado vazio

#### updateEmptyState()
```javascript
updateEmptyState()
```
- Mostra/esconde mensagens de carrinho vazio
- Baseado na presença de itens

#### openMobileCart()
```javascript
openMobileCart()
```
- Abre modal do carrinho mobile em telas pequenas
- Bloqueia scroll do body

#### closeMobileCart()
```javascript
closeMobileCart()
```
- Fecha modal do carrinho mobile
- Restaura scroll do body

#### clearCart()
```javascript
clearCart()
```
- Esvazia array do carrinho
- Atualiza interface
- Mostra toast de confirmação

#### showToast()
```javascript
showToast(texto)
```
- Cria elemento toast temporário
- Remove automaticamente após 2 segundos

## Ordem Lógica de Execução

1. **Carregamento da Página**
   - HTML é carregado
   - Scripts são executados em ordem

2. **Inicialização da Aplicação**
   - `DOMContentLoaded` dispara
   - `MarmitaApp` é instanciada
   - `init()` é chamado

3. **Carregamento de Dados**
   - `ProductCatalog.loadProdutos()` faz fetch do JSON
   - Produtos são renderizados em seções

4. **Configuração de Interações**
   - ModalManager inicializado com listeners
   - Filtros de categoria ligados
   - Ações globais do carrinho mobile ligadas

5. **Interação do Usuário**
   - Clique em produto abre modal
   - ModalManager popula conteúdo dinamicamente
   - Adicionar ao carrinho chama CartManager.addItem()
   - Carrinho é atualizado em tempo real

6. **Finalização de Pedido**
   - Botão "Finalizar Pedido" abre modal de localização
   - Geolocalização obtém endereço automaticamente
   - Usuário pode editar endereço manualmente

## Fluxo de Dados
- Dados fluem do JSON → ProductCatalog → ModalManager/CartManager
- Callbacks permitem comunicação entre classes sem acoplamento direto
- Estado do carrinho é mantido em memória (CartManager.carrinho)
- Interface é atualizada reativamente após mudanças de estado

## Tecnologias Utilizadas
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modulares com Flexbox/Grid
- **JavaScript ES6+**: Classes, async/await, arrow functions
- **Bootstrap 5**: Componentes responsivos
- **Fetch API**: Carregamento de dados JSON
- **Geolocation API**: Obtenção de localização do usuário

## Backend (Python + Flask)
O backend foi implementado em Python usando Flask para receber e processar os pedidos.

### Estrutura dos Dados Enviados
Quando o usuário finaliza o pedido, os seguintes dados são enviados via POST para `/api/pedidos`:

```json
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