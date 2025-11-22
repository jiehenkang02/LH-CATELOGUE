// ** This file contains your actual phone number, +60174187702.
const YOUR_PHONE_NUMBER = '+60174187702'; 

// Initialize the shopping cart array
let cart = [];

// The threshold for the cheaper wholesale price (2 boxes or more gets the discount)
const WHOLESALE_THRESHOLD = 2; 

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const viewCartButton = document.getElementById('view-cart-btn');

    // --- 1. ADD TO CART LOGIC ---
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productCard = event.target.closest('.product-card');
            const productName = productCard.getAttribute('data-product-name');
            
            // Get both price tiers from the data attributes
            const wholesalePrice = parseFloat(productCard.getAttribute('data-wholesale-price'));
            const singleBoxPrice = parseFloat(productCard.getAttribute('data-single-box-price'));
            const packingSize = productCard.querySelector('.size').textContent.replace('Packing Size: ', '').trim();
            
            // Get the quantity entered by the customer
            const quantityInput = productCard.querySelector('.item-quantity');
            const quantity = parseInt(quantityInput.value, 10);

            if (quantity > 0) {
                
                let priceApplied;
                let priceType;

                // --- TIERED PRICING LOGIC ---
                if (quantity >= WHOLESALE_THRESHOLD) {
                    priceApplied = wholesalePrice;
                    priceType = `WHOLESALE PRICE (RM${wholesalePrice.toFixed(2)}/KG)`;
                } else {
                    priceApplied = singleBoxPrice;
                    priceType = `SINGLE BOX PRICE (RM${singleBoxPrice.toFixed(2)}/KG)`;
                }
                
                // Format the price for the cart object
                const formattedPrice = `RM${priceApplied.toFixed(2)}/KG (${quantity}x${packingSize})`;

                // Find if the item is already in the cart
                const existingItem = cart.find(item => item.name === productName && item.priceType === priceType);

                if (existingItem) {
                    // If item exists with the *same price tier*, just increase the quantity
                    existingItem.quantity += quantity;
                } else {
                    // Otherwise, add the new item to the cart
                    cart.push({
                        name: productName,
                        quantity: quantity,
                        price: formattedPrice,
                        priceType: priceType // Store the exact price tier applied
                    });
                }
                
                // Reset quantity input to 1 after adding
                quantityInput.value = 1;

                alert(`${quantity} x ${productName} added to cart! Price applied: ${priceType}`);
                updateCartCount();
            } else {
                alert('Please enter a quantity greater than 0.');
            }
        });
    });
    
    // --- 2. UPDATE CART COUNTER LOGIC ---
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        viewCartButton.textContent = `View Cart & Order (${totalItems})`;
    }

    // --- 3. VIEW CART AND ORDER LOGIC ---
    viewCartButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add some products before ordering.');
            return;
        }

        let orderDetails = `Hello, I would like to place a bulk order for the following items:\n\n`;
        
        // Build the list of products for the WhatsApp message
        cart.forEach((item, index) => {
            // item.price already contains the quantity, packing size, and price
            orderDetails += `${index + 1}. *${item.name}*: ${item.price}\n`;
        });
        
        orderDetails += "\n---";
        orderDetails += `\nTotal Cartons/Boxes: ${cart.reduce((total, item) => total + item.quantity, 0)}`;
        orderDetails += "\n\nPlease confirm stock and arrange delivery. Thank you!";
        
        // Clear the cart after creating the message
        cart = [];
        updateCartCount();

        // URL-encode the message for the link
        const encodedMessage = encodeURIComponent(orderDetails);
        
        // Create the WhatsApp link
        const whatsappLink = `https://wa.me/${YOUR_PHONE_NUMBER.replace('+', '')}?text=${encodedMessage}`;
        
        // Open the link in a new tab
        window.open(whatsappLink, '_blank');
    });

    // Initialize the count on page load
    updateCartCount();
});