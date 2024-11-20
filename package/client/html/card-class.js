class MyStripe {
    constructor() {
        this.publishableKey = 'YOUR_STRIPE_KEY';
        this.stripe = null;
        this.elements = null;
        this.card = null;
        this.container = null;
    }

    addMessage(message) {
        const messagesDiv = document.querySelector('#messages');
        if (!messagesDiv) {
            console.error('Messages div not found');
            return;
        }
        messagesDiv.style.display = 'block';
        messagesDiv.innerHTML += `> ${message}<br>`;
        console.log(`Debug: ${message}`);
    }

    async loadStripeScript() {
        if (typeof window !== 'undefined' && typeof window.Stripe === 'function') {
            return; // Stripe is already loaded
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.async = true;
            script.onload = () => {
                if (typeof window.Stripe === 'function') {
                    resolve();
                } else {
                    reject(new Error('Stripe.js loaded, but Stripe function is undefined.'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load Stripe.js script.'));
            document.head.appendChild(script);
        });
    }

    async init() {
        await this.loadStripeScript();

        if (typeof window.Stripe === 'function') {
            this.stripe = window.Stripe(this.publishableKey, {
                apiVersion: '2020-08-27',
            });

            if (!this.stripe) {
                throw new Error('Failed to initialize Stripe. Please check your publishable key.');
            }

            this.elements = this.stripe.elements();
        } else {
            throw new Error('Stripe.js is not loaded or Stripe is unavailable.');
        }
    }

    mount(container, formId = 'stripe-payment-form', cardElementId = 'stripe-card-element') {
        if (!this.stripe || !this.elements) {
            console.error('Stripe not initialized');
            return;
        }

        this.container = container;

        // Create a form for submitting payments
        const form = document.createElement('form');
        form.id = formId;

        // Create the Name label and input field
        const nameLabel = document.createElement('label');
        nameLabel.setAttribute('for', 'stripe-name');
        nameLabel.textContent = 'Name';

        const nameInput = document.createElement('input');
        nameInput.id = 'stripe-name';
        nameInput.placeholder = 'Jenny Rosen';
        nameInput.value = 'Jenny Rosen';
        nameInput.required = true;

        // Create the Card label and container div for the card element
        const cardLabel = document.createElement('label');
        cardLabel.textContent = 'Card';

        const cardElement = document.createElement('div');
        cardElement.id = cardElementId;

        // Create the Pay button
        const payButton = document.createElement('button');
        payButton.type = 'submit';
        payButton.textContent = 'Pay';
        payButton.id = 'stripe-submit';

        // Create the Messages div for displaying messages
        const messagesDiv = document.createElement('div');
        messagesDiv.id = 'messages';
        messagesDiv.setAttribute('role', 'alert');
        messagesDiv.style.display = 'none';

        // Append elements to the form
        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(cardLabel);
        form.appendChild(cardElement);
        form.appendChild(payButton); // Append the Pay button at the end of the form
        form.appendChild(messagesDiv); // Append messagesDiv after cardElement

        // Append the form to the container
        this.container.appendChild(form);

        // Initialize and mount the card element
        this.card = this.elements.create('card', {
            style: {
                base: {
                    color: '#32325d',
                    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a',
                },
            },
        });
        this.card.mount(`#${cardElementId}`);

        // Attach submit handler
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (form) {
                await this.handlePayment(form);
            }
        });
    }

    async handlePayment(form) {
        const response = await fetch('http://localhost:4242/create-payment-intent', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                currency: 'usd',
                paymentMethodType: 'card',
            }),
        });

        const { error: backendError, clientSecret } = await response.json();

        if (backendError) {
            this.addMessage(backendError.message);
            return;
        }

        this.addMessage(`Client secret returned.`);

        const nameInput = document.querySelector('#stripe-name');
        if (!nameInput) {
            this.addMessage('Name input not found');
            return;
        }

        const { error: stripeError, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: this.card,
                billing_details: {
                    name: nameInput.value,
                },
            },
        });

        if (stripeError) {
            this.addMessage(stripeError.message ?? 'An error occurred');
            return;
        }

        this.addMessage(`Payment ${paymentIntent.status}: ${paymentIntent.id}`);
    }
}

module.exports = MyStripe;
