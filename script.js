// ==============================
// NEXUS O2 USERS
// ==============================

const users = {

    "ADVIK92": {
        password: "Cucumber",
        name: "Advik"
    },

    "MAANAS-TERRA": {
        password: "TERRA",
        name: "Maanas"
    },

    "HOTLANDS-Atharv": {
        password: "HOTLANDS",
        name: "Atharv"
    }

};


// ==============================
// LOGIN
// ==============================

const loginPage = document.getElementById("loginPage");
const dashboardPage = document.getElementById("dashboardPage");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");

const errorMessage = document.getElementById("errorMessage");
const welcomeText = document.getElementById("welcomeText");


function login() {

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (users[username] &&
        users[username].password === password) {

        loginPage.classList.add("hidden");
        dashboardPage.classList.remove("hidden");

        welcomeText.textContent =
            "Welcome, " +
            users[username].name +
            ". Your NEXUS O2 workspace is ready.";

        errorMessage.textContent = "";

    } else {

        errorMessage.textContent =
            "Invalid username or password.";

        passwordInput.value = "";
    }
}


function logout() {

    dashboardPage.classList.add("hidden");
    loginPage.classList.remove("hidden");

    usernameInput.value = "";
    passwordInput.value = "";

    showSection("homeSection");
}


// ==============================
// NAVIGATION
// ==============================

function showSection(sectionID) {

    document.getElementById("homeSection")
        .classList.add("hidden");

    document.getElementById("productsSection")
        .classList.add("hidden");

    document.getElementById(sectionID)
        .classList.remove("hidden");

    if (sectionID === "productsSection") {
        renderProducts();
    }
}


// ==============================
// PRODUCTS
// ==============================

// Default products.
// You can delete these and add your real products.

let products =
    JSON.parse(localStorage.getItem("nexusO2Products")) || [

        {
            id: 1,
            name: "Product Alpha",
            price: 100,
            quantity: 25
        },

        {
            id: 2,
            name: "Product Beta",
            price: 250,
            quantity: 12
        },

        {
            id: 3,
            name: "Product Gamma",
            price: 500,
            quantity: 8
        }

    ];


function saveProducts() {

    localStorage.setItem(
        "nexusO2Products",
        JSON.stringify(products)
    );
}


// ==============================
// ADD PRODUCT
// ==============================

function addProduct() {

    const name =
        document.getElementById("productName").value.trim();

    const price =
        Number(document.getElementById("productPrice").value);

    const quantity =
        Number(document.getElementById("productQuantity").value);


    if (!name) {
        alert("Please enter a product name.");
        return;
    }

    if (price < 0 || quantity < 0) {
        alert("Price and quantity cannot be negative.");
        return;
    }


    products.push({

        id: Date.now(),

        name: name,

        price: price,

        quantity: quantity

    });


    saveProducts();


    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productQuantity").value = "";


    renderProducts();
}


// ==============================
// DISPLAY PRODUCTS
// ==============================

function renderProducts() {

    const table =
        document.getElementById("productTable");

    const search =
        document.getElementById("searchProduct")
            .value
            .toLowerCase();


    table.innerHTML = "";


    const filteredProducts =
        products.filter(product =>
            product.name
                .toLowerCase()
                .includes(search)
        );


    filteredProducts.forEach(product => {

        const row =
            document.createElement("tr");


        const value =
            product.price * product.quantity;


        row.innerHTML = `

            <td>
                <strong>${product.name}</strong>
            </td>

            <td>
                ₹${product.price.toLocaleString()}
            </td>

            <td>
                ${product.quantity}
            </td>

            <td>
                ₹${value.toLocaleString()}
            </td>

            <td>

                <button
                    class="edit-button"
                    onclick="editProduct(${product.id})"
                >
                    EDIT
                </button>

                <button
                    class="delete-button"
                    onclick="deleteProduct(${product.id})"
                >
                    DELETE
                </button>

            </td>

        `;


        table.appendChild(row);

    });


    updateStatistics();
}


// ==============================
// EDIT PRODUCT
// ==============================

function editProduct(id) {

    const product =
        products.find(item => item.id === id);


    if (!product) return;


    const newPrice =
        prompt(
            "Enter the new price for " +
            product.name,
            product.price
        );


    if (newPrice === null) return;


    const newQuantity =
        prompt(
            "Enter the new quantity for " +
            product.name,
            product.quantity
        );


    if (newQuantity === null) return;


    const price =
        Number(newPrice);

    const quantity =
        Number(newQuantity);


    if (
        isNaN(price) ||
        isNaN(quantity) ||
        price < 0 ||
        quantity < 0
    ) {

        alert("Please enter valid numbers.");

        return;
    }


    product.price = price;
    product.quantity = quantity;


    saveProducts();
    renderProducts();
}


// ==============================
// DELETE PRODUCT
// ==============================

function deleteProduct(id) {

    const product =
        products.find(item => item.id === id);


    if (!product) return;


    const confirmDelete =
        confirm(
            "Delete " +
            product.name +
            "?"
        );


    if (!confirmDelete) return;


    products =
        products.filter(
            item => item.id !== id
        );


    saveProducts();

    renderProducts();
}


// ==============================
// STATISTICS
// ==============================

function updateStatistics() {

    const totalProducts =
        products.length;


    const totalQuantity =
        products.reduce(
            (total, product) =>
                total + product.quantity,
            0
        );


    const inventoryValue =
        products.reduce(
            (total, product) =>
                total +
                product.price *
                product.quantity,
            0
        );


    document.getElementById("totalProducts")
        .textContent = totalProducts;


    document.getElementById("totalQuantity")
        .textContent = totalQuantity;


    document.getElementById("inventoryValue")
        .textContent =
        "₹" +
        inventoryValue.toLocaleString();
}


// ==============================
// BUTTONS
// ==============================

loginButton.addEventListener(
    "click",
    login
);


logoutButton.addEventListener(
    "click",
    logout
);


passwordInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            login();
        }

    }
);


usernameInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            login();
        }

    }
);


// Initial display
renderProducts();
