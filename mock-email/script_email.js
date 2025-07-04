class ProductManager {
    constructor() {
        this.apiBaseUrl = "https://desafio-api.bold.workers.dev/products";
        this.currentPage = 1;
        this.productGrid = document.getElementById('product-grid');
        this.loadMoreButton = document.getElementById('load-more-button');
        this.isLoading = false;

        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
    }

    setupEventListeners() {
    if (this.loadMoreButton) {
        console.log('Botão pronto para ouvir clique.');
        this.loadMoreButton.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    }
}

    /**
     * Load products from API
     * @param {number} page - Page number to load
     */
    async loadProducts(page = 1) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.updateLoadMoreButton('Carregando...', false);

        try {
            const response = await fetch(`${this.apiBaseUrl}?page=${page}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.renderProducts(data.products);
            
            // Update next page info
            if (data.nextPage) {
                this.currentPage = page + 1;
                this.updateLoadMoreButton('Tem muito mais aqui. Vem ver!', true);
            } else {
                this.hideLoadMoreButton();
            }
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.updateLoadMoreButton('Erro ao carregar produtos', true);
        } finally {
            this.isLoading = false;
        }
    }

    loadMoreProducts() {
        this.loadProducts(this.currentPage);
    }

    /**
     * Render products to the grid
     * @param {Array} products - Array of product objects
     */
    renderProducts(products) {
        products.forEach(product => {
            const productCard = this.createProductCard(product);
            this.productGrid.appendChild(productCard);
        });
    }

    /**
     * Create a product card element
     * @param {Object} product - Product object
     * @returns {HTMLElement} Product card element
     */
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Format price values
        const formattedOldPrice = this.formatPrice(product.oldPrice);
        const formattedPrice = this.formatPrice(product.price);
        const formattedInstallmentValue = this.formatPrice(product.installments.value);
        
        card.innerHTML = `
            <img src="https:${product.image}" alt="${product.name}" loading="lazy">
            <h4>${product.name}</h4>
            <p>${product.description}</p>
            <div class="old-price">De: ${formattedOldPrice}</div>
            <div class="price">Por: ${formattedPrice}</div>
            <div class="installments">ou ${product.installments.count}x de ${formattedInstallmentValue}</div>
            <button class="buy-button" type="button">Comprar</button>
        `;
        
        // Add click event to buy button
        const buyButton = card.querySelector('.buy-button');
        buyButton.addEventListener('click', () => {
            this.handleBuyClick(product);
        });
        
        return card;
    }

    /**
     * Handle buy button click
     * @param {Object} product - Product object
     */
    handleBuyClick(product) {
        alert(`Produto "${product.name}" adicionado ao carrinho!`);
    }

    /**
     * Format price to Brazilian currency format
     * @param {number} price - Price value
     * @returns {string} Formatted price string
     */
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    /**
     * Update load more button text
     * @param {string} text - Button text
     * @param {boolean} enable - Enable/disable button
     */
    updateLoadMoreButton(text, enable = true) {
        if (this.loadMoreButton) {
            this.loadMoreButton.textContent = text;
            this.loadMoreButton.disabled = !enable;
        }
    }

    /**
     * Hide load more button
     */
    hideLoadMoreButton() {
        if (this.loadMoreButton) {
            this.loadMoreButton.style.display = 'none';
        }
    }
}

// Initialize the product manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ProductManager();
});

