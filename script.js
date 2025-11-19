const foodCards = document.querySelectorAll(".food-card");
const addButtons = document.querySelectorAll(".add-btn");
const cartItemsList = document.getElementById("cartItems");
const cartCountBadge = document.getElementById("cartCount");
const subtotalAmount = document.getElementById("subtotalAmount");
const deliveryAmount = document.getElementById("deliveryAmount");
const totalAmount = document.getElementById("totalAmount");
const cartSubtitle = document.getElementById("cartSubtitle");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const toast = document.getElementById("toast");
const cartPanel = document.getElementById("cartPanel");
const cartToggleBtn = document.getElementById("cartToggleBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const searchInput = document.getElementById("searchInput");
const chips = document.querySelectorAll(".chip");

let cart = [];

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}

function updateCartSubtitle() {
    if (cart.length === 0) {
        cartSubtitle.textContent = "No items added yet.";
    } else {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartSubtitle.textContent = `You have ${count} item${count > 1 ? "s" : ""} in your cart.`;
    }
}

function renderCart() {
    cartItemsList.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        const li = document.createElement("li");
        li.className = "cart-item";

        const main = document.createElement("div");
        main.className = "cart-item-main";

        const top = document.createElement("div");
        top.className = "cart-item-top";

        const name = document.createElement("span");
        name.className = "cart-item-name";
        name.textContent = item.name;

        const price = document.createElement("span");
        price.className = "cart-item-price";
        price.textContent = `₹${item.price}`;

        top.appendChild(name);
        top.appendChild(price);

        const bottom = document.createElement("div");
        bottom.className = "cart-item-bottom";

        const qtyControls = document.createElement("div");
        qtyControls.className = "qty-controls";

        const minusBtn = document.createElement("button");
        minusBtn.className = "qty-btn";
        minusBtn.textContent = "-";

        const qtyValue = document.createElement("span");
        qtyValue.className = "qty-value";
        qtyValue.textContent = item.quantity;

        const plusBtn = document.createElement("button");
        plusBtn.className = "qty-btn";
        plusBtn.textContent = "+";

        qtyControls.appendChild(minusBtn);
        qtyControls.appendChild(qtyValue);
        qtyControls.appendChild(plusBtn);

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "Remove";

        bottom.appendChild(qtyControls);
        bottom.appendChild(removeBtn);

        main.appendChild(top);
        main.appendChild(bottom);

        const lineTotal = document.createElement("div");
        lineTotal.textContent = `₹${item.price * item.quantity}`;

        li.appendChild(main);
        li.appendChild(lineTotal);

        cartItemsList.appendChild(li);

        minusBtn.addEventListener("click", () => decreaseQuantity(item.name));
        plusBtn.addEventListener("click", () => increaseQuantity(item.name));
        removeBtn.addEventListener("click", () => removeFromCart(item.name));
    });

    const delivery = subtotal > 0 ? 29 : 0;
    const total = subtotal + delivery;

    subtotalAmount.textContent = `₹${subtotal}`;
    deliveryAmount.textContent = `₹${delivery}`;
    totalAmount.textContent = `₹${total}`;
    cartCountBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    updateCartSubtitle();
}

function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    renderCart();
    showToast("Added to cart");
}

function increaseQuantity(name) {
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.quantity += 1;
    renderCart();
}

function decreaseQuantity(name) {
    const item = cart.find(i => i.name === name);
    if (!item) return;
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(i => i.name !== name);
    }
    renderCart();
}

function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    renderCart();
    showToast("Removed from cart");
}

addButtons.forEach(btn => {
    btn.addEventListener("click", event => {
        event.stopPropagation();
        const card = btn.closest(".food-card");
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price, 10);
        addToCart(name, price);
    });
});

foodCards.forEach(card => {
    card.addEventListener("click", event => {
        if (event.target.classList.contains("add-btn")) return;
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price, 10);
        addToCart(name, price);
    });
});

placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your cart is empty");
        return;
    }
    const total = totalAmount.textContent;
    alert(`Order placed successfully!\n\nTotal amount: ${total}\n\nThank you for ordering from EATUP.`);
    cart = [];
    renderCart();
});

cartToggleBtn.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
});

closeCartBtn.addEventListener("click", () => {
    cartPanel.classList.remove("open");
});

searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase().trim();
    foodCards.forEach(card => {
        const name = card.dataset.name.toLowerCase();
        const matches = name.includes(value);
        card.style.display = matches ? "flex" : "none";
    });
});

chips.forEach(chip => {
    chip.addEventListener("click", () => {
        chips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const category = chip.dataset.category;
        foodCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category === "all" || cardCategory === category) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });
        searchInput.value = "";
    });
});

renderCart();
