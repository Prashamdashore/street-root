
const products = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        category: "T-Shirt",
        price: 699,
        oldPrice: 999,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    },
    {
        id: 2,
        name: "Black Oversized Hoodie",
        category: "Hoodie",
        price: 1299,
        oldPrice: 1599,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"
    },
    {
        id: 3,
        name: "Blue Denim Jeans",
        category: "Jeans",
        price: 1499,
        oldPrice: 1899,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
    },
    {
        id: 4,
        name: "Casual Black T-Shirt",
        category: "T-Shirt",
        price: 599,
        oldPrice: 799,
        image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=600"
    },
    {
        id: 5,
        name: "Premium Grey Hoodie",
        category: "Hoodie",
        price: 1399,
        oldPrice: 1699,
        image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600"
    },
    {
        id: 6,
        name: "Street Denim",
        category: "Jeans",
        price: 1199,
        oldPrice: 1499,
        image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600"
    },
    {
        id: 7,
        name: "Premium Basic Tee",
        category: "T-Shirt",
        price: 799,
        oldPrice: 999,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600"
    },
    {
        id: 8,
        name: "Urban Hoodie",
        category: "Hoodie",
        price: 1599,
        oldPrice: 1999,
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600"
    }
];

let cart = JSON.parse(localStorage.getItem("streetRootCart")) || [];
let wishlist = [];
let currentFilter = "All";

const productGrid = document.getElementById("productGrid");

const cartCount = document.getElementById("cartCount");

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

const cartDrawer = document.getElementById("cartDrawer");

const overlay = document.getElementById("overlay");


// DISPLAY PRODUCTS

function displayProducts() {

    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const filtered = products.filter(product => {

        const matchesSearch =
            product.name.toLowerCase().includes(search);

        const matchesFilter =
            currentFilter === "All" ||
            product.category === currentFilter;

        const matchesWishlist =
            !showWishlist || wishlist.includes(product.id);

        return matchesSearch && matchesFilter && matchesWishlist;
    });

    if (filtered.length === 0) {
        productGrid.innerHTML =
            "<p>No products found.</p>";
        return;
    }

    productGrid.innerHTML = filtered.map(product => `

        <div class="product-card">

            <button
                class="wishlist ${wishlist.includes(product.id) ? "liked" : ""}"
                data-wish="${product.id}">
                ${wishlist.includes(product.id) ? "♥" : "♡"}
            </button>

           <img
    src="${product.image}"
    alt="${product.name}"
    data-details="${product.id}"
>



            <div class="product-info">

               <h3 data-details="${product.id}">
    ${product.name}
</h3>

                <p>
                    ₹${product.price}
                    <del>₹${product.oldPrice}</del>
                </p>

                <button class="add-btn" data-add="${product.id}">
                    ADD TO BAG
                </button>

            </div>

        </div>

    `).join("");
}

// PRODUCT GRID CLICK EVENTS

productGrid.addEventListener("click", event => {

    const detailsButton = event.target.closest("[data-details]");
    const addButton = event.target.closest("[data-add]");
    const wishButton = event.target.closest("[data-wish]");

    // Open Product Details
    if (detailsButton) {
        openProductDetails(Number(detailsButton.dataset.details));
    }

    // Add to Bag opens Product Details
    if (addButton) {
        openProductDetails(Number(addButton.dataset.add));
    }

    // Wishlist
    if (wishButton) {

        const id = Number(wishButton.dataset.wish);

        if (wishlist.includes(id)) {
            wishlist = wishlist.filter(item => item !== id);
        } else {
            wishlist.push(id);
        }

        displayProducts();
    }

});


// FILTERS

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayProducts();
    });
});


// CATEGORY CARDS

document.querySelectorAll(".category-card button")
    .forEach(button => {

        button.addEventListener("click", () => {

            currentFilter = button.dataset.category;

            document.querySelectorAll(".filter")
                .forEach(btn => {
                    btn.classList.toggle(
                        "active",
                        btn.dataset.filter === currentFilter
                    );
                });

            showWishlist = false;
            displayProducts();

            document.getElementById("shop")
                .scrollIntoView({ behavior: "smooth" });
        });
    });


// SEARCH

document.getElementById("searchInput")
    .addEventListener("input", displayProducts);

document.getElementById("searchToggle")
    .addEventListener("click", () => {

        document.getElementById("searchArea")
            .classList.toggle("show");

    });


// CART

function addToCart(id, size, quantity) {
    const product = products.find(p => p.id === id);

    const existing = cart.find(
        item => item.id === id && item.size === size
    );

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            ...product,
            size: size,
            quantity: quantity
        });
    }

    updateCart();
    closeDetails();
    openCart();
}

function updateCart() {
    localStorage.setItem("streetRootCart", JSON.stringify(cart));

    let count = 0;
    let total = 0;

    cart.forEach(item => {
        count += item.quantity;
        total += item.price * item.quantity;
    });

    cartCount.textContent = count;

    cartTotal.textContent = "Total: ₹" + total;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your bag is empty.</p>";
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `

        <div class="cart-item">

            <div>
                <h4>${item.name}</h4>
                <p>Size: ${item.size}</p>

                <p>₹${item.price}</p>

                <button data-minus="${index}">-</button>

                ${item.quantity}

                <button data-plus="${index}">+</button>

                <br>

               <button data-remove="${index}">
    Remove
</button>
            </div>

            <strong>₹${item.price * item.quantity}</strong>

        </div>

    `).join("");
}



// CART EVENTS

cartItems.addEventListener("click", event => {

    const plus = event.target.dataset.plus;
    const minus = event.target.dataset.minus;
    const remove = event.target.dataset.remove;

    if (plus !== undefined) {
        cart[Number(plus)].quantity++;
    }

    if (minus !== undefined) {

        const index = Number(minus);

        cart[index].quantity--;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }

    if (remove !== undefined) {
        cart.splice(Number(remove), 1);
    }

    updateCart();

});




cartItems.addEventListener("click", event => {

    const index = event.target.dataset.index;

    const plus = event.target.dataset.plus;
    const minus = event.target.dataset.minus;
    const remove = event.target.dataset.remove;

    if (plus !== undefined) {
        cart[Number(plus)].quantity++;
    }

    if (minus !== undefined) {

        const itemIndex = Number(minus);

        cart[itemIndex].quantity--;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }

    if (remove !== undefined) {
        cart.splice(Number(remove), 1);
    }

    updateCart();

})

cartItems.addEventListener("click", event => {

    const plus = event.target.dataset.plus;
    const minus = event.target.dataset.minus;
    const remove = event.target.dataset.remove;

    if (plus) {
        cart.find(i => i.id === Number(plus)).quantity++;
    }

    if (minus) {

        const item = cart.find(i => i.id === Number(minus));

        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== item.id);
        }
    }

    if (remove) {
        cart = cart.filter(i => i.id !== Number(remove));
    }

    updateCart();
});


// CART DRAWER

function openCart() {
    cartDrawer.classList.add("show");
    overlay.classList.add("show");
}

function closeCart() {
    cartDrawer.classList.remove("show");
    overlay.classList.remove("show");
}

document.getElementById("cartToggle")
    .addEventListener("click", openCart);

document.getElementById("closeCart")
    .addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);


// WISHLIST

let showWishlist = false;

document.getElementById("wishlistToggle")
    .addEventListener("click", () => {

        showWishlist = !showWishlist;

        document.getElementById("shop")
            .scrollIntoView({ behavior: "smooth" });

        displayProducts();
    });


// CHECKOUT DEMO

document.getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Your bag is empty!");
        } else {
            alert("Checkout functionality is coming soon!");
        }
    });


// NEWSLETTER DEMO

document.getElementById("newsletterForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        alert("Thank you for joining STREET ROOT!");

        document.getElementById("emailInput").value = "";
    });


// PRODUCT DETAILS

let selectedProduct = null;
let selectedSize = "";
let detailQuantity = 1;

const detailsOverlay = document.getElementById("detailsOverlay");


// OPEN PRODUCT DETAILS

function openProductDetails(id) {

    selectedProduct = products.find(product => product.id === id);

    if (!selectedProduct) return;

    selectedSize = "";
    detailQuantity = 1;

    document.getElementById("detailImage").src = selectedProduct.image;

    document.getElementById("detailImage").alt = selectedProduct.name;

    document.getElementById("detailName").textContent = selectedProduct.name;

    document.getElementById("detailPrice").textContent =
        "₹" + selectedProduct.price;

    document.getElementById("detailDescription").textContent =
        "Discover everyday comfort with our " +
        selectedProduct.name +
        ". Designed for modern streetwear style.";

    document.getElementById("detailQty").textContent = 1;

    document.querySelectorAll(".size-btn").forEach(button => {
        button.classList.remove("active");
    });

    detailsOverlay.classList.add("show");
}


// CLOSE PRODUCT DETAILS

function closeDetails() {

    detailsOverlay.classList.remove("show");

}


// SELECT SIZE

document.querySelectorAll(".size-btn").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".size-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedSize = button.dataset.size;

    });

});


// INCREASE QUANTITY

document.getElementById("qtyPlus").addEventListener("click", () => {

    if (detailQuantity < 10) {
        detailQuantity++;
    }

    document.getElementById("detailQty").textContent = detailQuantity;

});


// DECREASE QUANTITY

document.getElementById("qtyMinus").addEventListener("click", () => {

    if (detailQuantity > 1) {
        detailQuantity--;
    }

    document.getElementById("detailQty").textContent = detailQuantity;

});


// CLOSE BUTTON

document.getElementById("detailsClose").addEventListener("click", closeDetails);


// CLOSE WHEN CLICKING OUTSIDE

detailsOverlay.addEventListener("click", event => {

    if (event.target === detailsOverlay) {
        closeDetails();
    }

});


// ADD TO CART BUTTON

document.getElementById("detailAddCart").addEventListener("click", () => {

    if (!selectedSize) {
        alert("Please select a size first!");
        return;
    }

    addToCart(
        selectedProduct.id,
        selectedSize,
        detailQuantity
    );

});

// INITIALIZE

displayProducts();
updateCart();
