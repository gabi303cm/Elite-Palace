let cart = [];
let totalAmount = 0;

function addToCart(productName, price) {
    cart.push({ productName, price });
    totalAmount += price;
    displayCart();
}

function displayCart() {
    const cartContainer = document.getElementById('cart');
    const totalContainer = document.getElementById('total');
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.textContent = `${item.productName} - ${item.price} BDT`;
        cartContainer.appendChild(cartItem);
    });

    totalContainer.textContent = `Total: ${totalAmount} BDT`;
}

function payWithBkash() {
    // Placeholder for Bkash API integration
    alert("Bkash payment integration will be available soon. Total: " + totalAmount + " BDT.");
}

function payOnDelivery() {
    // Add COD fee
    const totalWithCOD = totalAmount + 100;
    alert("Total with COD fee (100 BDT): " + totalWithCOD + " BDT. Thank you for choosing Cash on Delivery!");
}

// PayPal Integration
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: totalAmount // Set the total amount dynamically
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert('Payment completed successfully. Thank you, ' + details.payer.name.given_name);
            // You can send the order details to your backend for processing.
        });
    },
    onError: function(err) {
        alert('Payment failed. Please try again.');
    }
}).render('#paypal-button-container');
