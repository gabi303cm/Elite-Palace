// Sample products with size and color
const products = [
    { id: 1, name: "Luxury Watch", price: 5000, image: "https://picsum.photos/300/200?random=1", size: "Medium", color: "Silver" },
    { id: 2, name: "Designer Bag", price: 3000, image: "https://picsum.photos/300/200?random=2", size: "Large", color: "Black" },
    { id: 3, name: "Premium Shoes", price: 2500, image: "https://picsum.photos/300/200?random=3", size: "42", color: "White" },
    { id: 4, name: "Smart Phone", price: 15000, image: "https://picsum.photos/300/200?random=4", size: "6.5 inch", color: "Space Gray" },
];

let cart = [];
let currentUser = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    // Hide loader after 1 second
    setTimeout(() => {
        document.getElementById("loader").style.display = "none";
    }, 1000);

    // Check if we're on the main page
    const productGrid = document.getElementById("productGrid");
    if (productGrid) {
        displayProducts(products);
        checkLoginStatus();
    }

    // Setup login form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    // Setup signup form
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", handleSignup);
    }

    // Setup delivery label buttons
    const labelButtons = document.querySelectorAll(".label-btn");
    labelButtons.forEach(button => {
        button.addEventListener("click", () => {
            labelButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });

    // Scroll to top button
    const scrollToTopBtn = document.getElementById("scrollToTop");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add("visible");
        } else {
            scrollToTopBtn.classList.remove("visible");
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// Database simulation using localStorage
function saveUser(user) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

// Authentication functions
function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        alert("Email already registered!");
        return;
    }

    const user = { username, email, password };
    saveUser(user);
    alert("Signup successful! Please login.");
    window.location.href = "login.html";
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid email or password!");
    }
}

function checkLoginStatus() {
    currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
        document.getElementById("authLinks").style.display = "none";
        document.getElementById("logoutLink").style.display = "block";
    }
}

function logout() {
    localStorage.removeItem("currentUser");
    currentUser = null;
    document.getElementById("authLinks").style.display = "block";
    document.getElementById("logoutLink").style.display = "none";
    window.location.reload();
}

// Product display and cart functions
function displayProducts(productList) {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) {
        console.error("Product grid element not found!");
        return;
    }
    productGrid.innerHTML = "";
    productList.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>৳${product.price}</p>
            <p>Size: ${product.size}</p>
            <p>Color: ${product.color}</p>
            <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

function addToCart(productId) {
    if (!currentUser) {
        alert("Please login to add items to cart!");
        window.location.href = "login.html";
        return;
    }
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartItemCount = document.getElementById("cartItemCount");
    const itemsTotal = document.getElementById("itemsTotal");
    
    cartCount.textContent = cart.length;
    cartItems.innerHTML = "";
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            ${item.name} (${item.size}, ${item.color}) - ৳${item.price}
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    const totalItemsPrice = cart.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = 60;
    const total = totalItemsPrice + deliveryFee;
    
    cartItemCount.textContent = cart.length;
    itemsTotal.textContent = totalItemsPrice;
    cartTotal.textContent = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function showCart() {
    if (!currentUser) {
        alert("Please login to view cart!");
        window.location.href = "login.html";
        return;
    }
    document.getElementById("cartModal").style.display = "block";
    updateCart();
}

function hideCart() {
    document.getElementById("cartModal").style.display = "none";
}

function searchProducts() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

function checkout() {
    if (!currentUser) {
        alert("Please login to checkout!");
        window.location.href = "login.html";
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    if (!paymentMethod) {
        alert("Please select a payment method");
        return;
    }
    
    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    // Validate delivery information
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const addressLine1 = document.getElementById("addressLine1").value;
    const region = document.getElementById("region").value;
    const city = document.getElementById("city").value;
    const area = document.getElementById("area").value;

    if (!fullName || !phoneNumber || !addressLine1 || !region || !city || !area) {
        alert("Please fill in all required delivery information");
        return;
    }

    const totalItemsPrice = cart.reduce((sum, item) => sum + item.price, 0);
    const deliveryFee = 60;
    const total = totalItemsPrice + deliveryFee;
    let message = `Order placed successfully!\nTotal: ৳${total}\nPayment Method: ${paymentMethod.value === 'cod' ? 'Cash on Delivery' : 'bKash'}`;
    
    if (paymentMethod.value === 'cod') {
        cart.forEach(item => {
            const codMessage = `To: gabi303cm12345@gmail.com\nSubject: New COD Order\n\nSomeone ordered:\nProduct: ${item.name}\nUsername: ${currentUser.username}\nProduct Picture: ${item.image}\nSize: ${item.size}\nColor: ${item.color}\nDelivery Address: ${fullName}, ${addressLine1}, ${area}, ${city}, ${region}\nPhone: ${phoneNumber}`;
            alert(codMessage);
        });
    } else if (paymentMethod.value === 'bkash') {
        message += "\nPlease send payment to: 01XXX-XXXXXX";
    }
    
    alert(message);
    cart = [];
    updateCart();
    hideCart();
}