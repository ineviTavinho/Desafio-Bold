

class productManager{

    constructor(){
        this.apiBaseUrl = "https://desafio-api.bold.workers.dev/products";
        this.currentPage = 1;
        this.productGrid  = document.getElementById('product-grid');
        this.loadMoreButton = document.getElementById('load-more-button');
        this.isLoading = false;

        this.init();
    }


    init(){
        this.loadProducts();
        this.setupEventListeners();

    }

    setupEventListeners() {
    if (this.loadMoreButton) {
        this.loadMoreButton.addEventListener('click', () => {
            this.loadMoreProducts();
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
        this.updateLoadMoreButton('Carregando...');

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
                this.updateLoadMoreButton('Ainda mais produtos aqui!');
            } else {
                this.hideLoadMoreButton();
            }
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.updateLoadMoreButton('Erro ao carregar produtos');
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
            <div class = "card-mobile">
                <section>
                    <img src="https:${product.image}" alt="${product.name}" loading="lazy">
                </section>
                <section class="details-mobile">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <div class="old-price">De: ${formattedOldPrice}</div>
                    <div class="price">Por: ${formattedPrice}</div>
                    <div class="installments">ou ${product.installments.count}x de ${formattedInstallmentValue}</div>
                    <button id = "buy-button" type="button">Comprar</button>
                </section>
            </div>
        `;
        
        return card;
    }


    /**
     * Format price to Brazilian format
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
     */
    updateLoadMoreButton(text, enable = true) {
        this.loadMoreButton.textContent = text;
        this.loadMoreButton.disabled = !enable;
    }

    /**
     * Hide load more button
     */
    hideLoadMoreButton() {
        this.loadMoreButton.style.display = 'none';
    }
}

// Initialize the product manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new productManager();
});


class NewsletterManager {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.nameInput = document.getElementById('friend-name');
        this.emailInput = document.getElementById('friend-email');          
        
        this.init();
    }

    /**
     * Initialize the newsletter manager
     */
    init() {
        this.setupEventListeners();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Real-time validation
        this.nameInput.addEventListener('blur', () => {
            this.validateName();
        });

        this.emailInput.addEventListener('blur', () => {
            this.validateEmail();
        });
    }

    /**
     * Handle form submission
     */
    handleSubmit() {
        const isNameValid = this.validateName();
        const isEmailValid = this.validateEmail();

        if (isNameValid && isEmailValid) {
            this.submitForm();
        }
    }

    /**
     * Validate name field
     * @returns {boolean} Validation result
     */
    validateName() {
        const name = this.nameInput.value.trim();
        
        if (name.length < 2) {
            this.showFieldError(this.nameInput, 'Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
            this.showFieldError(this.nameInput, 'Nome deve conter apenas letras');
            return false;
        }
        
        this.clearFieldError(this.nameInput);
        return true;
    }

    /**
     * Validate email field
     * @returns {boolean} Validation result
     */
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.showFieldError(this.emailInput, 'Por favor, insira um email válido');
            return false;
        }
        
        this.clearFieldError(this.emailInput);
        return true;
    }

    /**
     * Show field error message
     * @param {HTMLElement} field - Input field element
     * @param {string} message - Error message
     */
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.8em';
        errorElement.style.marginTop = '0px';
        errorElement.style.margin = '0px'
        
        field.parentNode.appendChild(errorElement);
        field.style.borderColor = '#e74c3c';
    }

    /**
     * Clear field error message
     * @param {HTMLElement} field - Input field element
     */
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '#ddd';
    }

    /**
     * Submit form data
     */
    submitForm() {
        const formData = {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim()
        }
        
        // Show success message
        this.showSuccessMessage();
        
        // Reset form
        this.form.reset();
    }

    /**
     * Show success message
     */
    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Obrigado! Seu amigo receberá nossas novidades em breve.';
        successMessage.style.cssText = `
            background-color: #555;
            color: white;
            padding: 15px;
            border-radius: 5px;
            margin-top: 15px;
            text-align: center;
            position: absolute;
        `;
        
        this.form.appendChild(successMessage);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
            window.location.href = 'mock-email/email.html';
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new productManager();
    new NewsletterManager();
});

