// ** This file contains your actual phone number, +60174187702.
const YOUR_PHONE_NUMBER = '+60174187702'; 

document.addEventListener('DOMContentLoaded', () => {
    const orderButtons = document.querySelectorAll('.order-btn');

    orderButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Get data from the product card
            const productCard = event.target.closest('.product-card');
            const productName = productCard.getAttribute('data-product-name');
            const priceElement = productCard.querySelector('.price');
            const sizeElement = productCard.querySelector('.size');
            
            // Extract text details
            const priceText = priceElement ? priceElement.textContent.replace('Price: ', '').trim() : 'Price Unknown';
            const packingSize = sizeElement ? sizeElement.textContent.replace('Packing Size: ', '').trim() : 'Size Unknown';

            // Create the pre-filled message for a wholesale order
            const message = `Hello, I would like to place a wholesale order for one carton of *${productName}*. Packing Size: ${packingSize}, Price: ${priceText}. Please confirm stock and delivery details. Thank you!`;
            
            // URL-encode the message for the link
            const encodedMessage = encodeURIComponent(message);
            
            // Create the WhatsApp link
            // Note: .replace('+', '') removes the plus sign for the wa.me link to work correctly
            const whatsappLink = `https://wa.me/${YOUR_PHONE_NUMBER.replace('+', '')}?text=${encodedMessage}`;
            
            // Open the link in a new tab
            window.open(whatsappLink, '_blank');
        });
    });
});