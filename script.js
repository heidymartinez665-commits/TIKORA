
const newSaleButton = document.getElementById("newSaleButton");
const saleModal = document.getElementById("saleModal");
const closeSaleModal = document.getElementById("closeSaleModal");
const saleForm = document.getElementById("saleForm");

const productQuantity = document.getElementById("productQuantity");
const productPrice = document.getElementById("productPrice");
const saleTotal = document.getElementById("saleTotal");
const receiptsTable = document.getElementById("receiptsTable");

const STORAGE_KEY = "tikora_sales";

let sales = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function formatMoney(value) {
    return value.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}

function saveSales() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}
function updateReceiptBusinessInfo() {
    document.getElementById("receiptBusinessName").textContent =
        businessSettings.name || "Nombre de tu negocio";

    document.getElementById("receiptBusinessPhone").textContent =
        businessSettings.phone || "";

    document.getElementById("receiptBusinessAddress").textContent =
        businessSettings.address || "";
            document.getElementById("receiptBusinessMessage").textContent =
        businessSettings.message || "¡Gracias por tu compra!";
}
function calculateTotal() {
    const quantity = Number(productQuantity.value) || 0;
    const price = Number(productPrice.value) || 0;
    saleTotal.textContent = formatMoney(quantity * price);
}

function renderSales() {
    receiptsTable.innerHTML = "";

    if (sales.length === 0) {
        receiptsTable.innerHTML = `
            <tr>
                <td colspan="5">Aún no hay ventas registradas.</td>
            </tr>
        `;
        return;
    }

    sales.slice().reverse().forEach(sale => {
        const row = document.createElement("tr");

        const numberCell = document.createElement("td");
        const dateCell = document.createElement("td");
        const customerCell = document.createElement("td");
        const totalCell = document.createElement("td");
        const statusCell = document.createElement("td");

        numberCell.textContent = sale.number;
        dateCell.textContent = sale.date;
        customerCell.textContent = `${sale.customer} - ${sale.product}`;
        totalCell.textContent = formatMoney(sale.total);
        statusCell.textContent = "Registrado";

        row.append(numberCell, dateCell, customerCell, totalCell, statusCell);
        receiptsTable.appendChild(row);
    });
}

function updateStats() {
    const now = new Date();

    const todaySales = sales.filter(sale => {
        const date = new Date(sale.dateISO);
        return date.toDateString() === now.toDateString();
    });

    const monthSales = sales.filter(sale => {
        const date = new Date(sale.dateISO);
        return date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    });

    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const monthTotal = monthSales.reduce((sum, sale) => sum + sale.total, 0);
    const customers = new Set(sales.map(sale => sale.customer.trim().toLowerCase()));

    document.getElementById("receiptCount").textContent = sales.length;
    document.getElementById("customerCount").textContent = customers.size;
    document.getElementById("todaySales").textContent = formatMoney(todayTotal);
    document.getElementById("monthSales").textContent = formatMoney(monthTotal);
}

function refreshApp() {
    saveSales();
    renderSales();
    updateStats();
}

// HISTORIAL Y NAVEGACIÓN
const historySection = document.getElementById("historySection");
const historyTable = document.getElementById("historyTable");
const mainContent = document.querySelector(".main-content");

const navItems = document.querySelectorAll(".sidebar-nav .nav-item");

const historyButton = [...navItems].find(item =>
    item.textContent.includes("Historial")
);

const homeButton = [...navItems].find(item =>
    item.textContent.includes("Inicio")
);
// BOTÓN CREAR RECIBO DEL MENÚ
const createReceiptButton = [...navItems].find(item =>
    item.textContent.includes("Crear recibo")
);

createReceiptButton.addEventListener("click", function(event) {
    event.preventDefault();

    homeButton.click();

    saleModal.style.display = "flex";
    saleForm.reset();
    calculateTotal();
});
function renderHistory() {
    historyTable.innerHTML = "";

    if (sales.length === 0) {
        historyTable.innerHTML = `
            <tr>
                <td colspan="7">Aún no hay ventas registradas.</td>
            </tr>
        `;
        return;
    }

    sales.slice().reverse().forEach(sale => {
        const row = document.createElement("tr");

        const values = [
            sale.number,
            sale.date,
            sale.customer,
            sale.product,
            sale.quantity,
            formatMoney(sale.price),
            formatMoney(sale.total)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        historyTable.appendChild(row);
    });
}

historyButton.addEventListener("click", function(event) {
    event.preventDefault();

    [...mainContent.children].forEach(child => {
        if (
            child !== historySection &&
            !child.classList.contains("footer") &&
            child.id !== "saleModal"
        ) {
            child.style.display = "none";
        }
    });

    historySection.style.display = "block";

    navItems.forEach(item => item.classList.remove("active"));
    historyButton.classList.add("active");

    renderHistory();
});




homeButton.addEventListener("click", function(event) {
    event.preventDefault();

    historySection.style.display = "none";
    productsSection.style.display = "none";
    statisticsSection.style.display = "none";
    settingsSection.style.display = "none";

    [...mainContent.children].forEach(child => {
        if (
            child !== historySection &&
            child !== productsSection &&
            child !== statisticsSection &&
            child !== settingsSection &&
            child.id !== "saleModal"
        ) {
            child.style.display = "";
        }
    });

    navItems.forEach(item => item.classList.remove("active"));
    homeButton.classList.add("active");
});



// ADMINISTRAR PRODUCTOS
const productsSection = document.getElementById("productsSection");
const productsTable = document.getElementById("productsTable");
const productForm = document.getElementById("productForm");

const newProductName = document.getElementById("newProductName");
const newProductPrice = document.getElementById("newProductPrice");

const productsButton = [...navItems].find(item =>
    item.textContent.includes("Productos")
);
// ESTADÍSTICAS
const statisticsSection = document.getElementById("statisticsSection");

const statisticsButton = [...navItems].find(item =>
    item.textContent.includes("Estadísticas")
);

// CONFIGURACIÓN DEL NEGOCIO
const settingsSection = document.getElementById("settingsSection");
const settingsForm = document.getElementById("settingsForm");

const settingsButton = [...navItems].find(item =>
    item.textContent.includes("Configuración")
);

const businessName = document.getElementById("businessName");
const businessPhone = document.getElementById("businessPhone");
const businessAddress = document.getElementById("businessAddress");
const receiptMessage = document.getElementById("receiptMessage");

const SETTINGS_STORAGE_KEY = "tikora_settings";

let businessSettings = JSON.parse(
    localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}"
);

businessName.value = businessSettings.name || "";
businessPhone.value = businessSettings.phone || "";
businessAddress.value = businessSettings.address || "";
receiptMessage.value = businessSettings.message || "";
updateReceiptBusinessInfo();
// ABRIR CONFIGURACIÓN
settingsButton.addEventListener("click", function(event) {
    event.preventDefault();

    [...mainContent.children].forEach(child => {
        if (
            child !== settingsSection &&
            !child.classList.contains("footer") &&
            child.id !== "saleModal"
        ) {
            child.style.display = "none";
        }
    });

    settingsSection.style.display = "block";

    navItems.forEach(item => item.classList.remove("active"));
    settingsButton.classList.add("active");
});

// GUARDAR CONFIGURACIÓN
settingsForm.addEventListener("submit", function(event) {
    event.preventDefault();

    businessSettings = {
        name: businessName.value.trim(),
        phone: businessPhone.value.trim(),
        address: businessAddress.value.trim(),
        message: receiptMessage.value.trim()
    };

    localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(businessSettings)
    );
updateReceiptBusinessInfo();
    document.getElementById("settingsSavedMessage").textContent =
        "¡Configuración guardada correctamente!";
});

const PRODUCTS_STORAGE_KEY = "tikora_products";

let products = JSON.parse(
    localStorage.getItem(PRODUCTS_STORAGE_KEY) || "[]"
);

function saveProducts() {
    localStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(products)
    );
}

function renderProducts() {
    productsTable.innerHTML = "";

    if (products.length === 0) {
        productsTable.innerHTML = `
            <tr>
                <td colspan="2">Todavía no hay productos.</td>
            </tr>
        `;
        return;
    }

    products.forEach(product => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const priceCell = document.createElement("td");

        nameCell.textContent = product.name;
        priceCell.textContent = formatMoney(product.price);

        row.append(nameCell, priceCell);
        productsTable.appendChild(row);
    });
}

// Guardar un producto nuevo
productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = newProductName.value.trim();
    const price = Number(newProductPrice.value);

    if (!name || !Number.isFinite(price) || price < 0) {
        alert("Revisa el nombre y el precio del producto.");
        return;
    }

    products.push({ name, price });

    saveProducts();
    renderProducts();

    productForm.reset();

    alert("¡Producto guardado correctamente!");
});

// Abrir pantalla de Productos
productsButton.addEventListener("click", function(event) {
    event.preventDefault();

    [...mainContent.children].forEach(child => {
        if (
            child !== productsSection &&
            !child.classList.contains("footer") &&
            child.id !== "saleModal"
        ) {
            child.style.display = "none";
        }
    });

    productsSection.style.display = "block";

    navItems.forEach(item => item.classList.remove("active"));
    productsButton.classList.add("active");

    renderProducts();
});

// Cargar productos guardados
renderProducts();

// ABRIR PANTALLA DE ESTADÍSTICAS
statisticsButton.addEventListener("click", function(event) {
    event.preventDefault();

    [...mainContent.children].forEach(child => {
        if (
            child !== statisticsSection &&
            !child.classList.contains("footer") &&
            child.id !== "saleModal"
        ) {
            child.style.display = "none";
        }
    });

    statisticsSection.style.display = "block";

    navItems.forEach(item => item.classList.remove("active"));
    statisticsButton.classList.add("active");

    const now = new Date();

    const todaySales = sales.filter(sale =>
        new Date(sale.dateISO).toDateString() === now.toDateString()
    );

    const monthSales = sales.filter(sale => {
        const date = new Date(sale.dateISO);

        return date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    });

    const todayTotal = todaySales.reduce(
        (sum, sale) => sum + sale.total, 0
    );

    const monthTotal = monthSales.reduce(
        (sum, sale) => sum + sale.total, 0
    );

    const customers = new Set(
        sales.map(sale => sale.customer.trim().toLowerCase())
    );

    document.getElementById("statsTodaySales").textContent = formatMoney(todayTotal);
    document.getElementById("statsMonthSales").textContent = formatMoney(monthTotal);
    document.getElementById("statsReceiptCount").textContent = sales.length;
    document.getElementById("statsCustomerCount").textContent = customers.size;
});

// Abrir formulario
newSaleButton.addEventListener("click", function () {
    saleModal.style.display = "flex";
    saleForm.reset();
    calculateTotal();
});

// Cerrar formulario
closeSaleModal.addEventListener("click", function () {
    saleModal.style.display = "none";
});

// Calcular total automáticamente
productQuantity.addEventListener("input", calculateTotal);
productPrice.addEventListener("input", calculateTotal);
// GENERAR COMPROBANTE DE VENTA

function generateReceipt(sale) {
    const safe = value => String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);

    const receiptWindow = window.open("", "_blank");

    if (!receiptWindow) {
        alert("Permite las ventanas emergentes para imprimir el recibo.");
        return;
    }
const whatsappMessage = [
    "RECIBO DE VENTA - TIKORA",
    "Número: " + sale.number,
    "Fecha: " + sale.date,
    "Cliente: " + sale.customer,
    "Producto: " + sale.product,
    "Cantidad: " + sale.quantity,
    "Precio unitario: " + formatMoney(sale.price),
    "TOTAL: " + formatMoney(sale.total),
    businessSettings.message || "¡Gracias por tu compra!"
].join("\n");
    receiptWindow.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recibo ${safe(sale.number)}</title>

            <style>
                * {
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    background: #f1f4f8;
                    color: #263445;
                    margin: 0;
                    padding: 30px 15px;
                }

                .receipt {
                    max-width: 430px;
                    margin: auto;
                    background: white;
                    padding: 30px;
                    border-radius: 14px;
                    box-shadow: 0 5px 25px rgba(0,0,0,0.08);
                }

                .header {
                    text-align: center;
                    border-bottom: 2px solid #e7edf4;
                    padding-bottom: 20px;
                }

                .logo {
                    color: #2563a6;
                    font-size: 32px;
                    font-weight: bold;
                    letter-spacing: 3px;
                    margin: 0;
                }

                .slogan {
                    color: #8995a5;
                    font-size: 11px;
                    letter-spacing: 2px;
                }

                .business-info {
                    color: #687789;
                    font-size: 13px;
                    line-height: 1.6;
                }

                .title {
                    text-align: center;
                    margin: 22px 0;
                    color: #2563a6;
                    font-size: 19px;
                }

                .number {
                    background: #edf4fb;
                    color: #2563a6;
                    padding: 9px;
                    border-radius: 7px;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .section-title {
                    color: #2563a6;
                    font-size: 12px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    letter-spacing: 1px;
                }

                .details {
                    font-size: 13px;
                    line-height: 1.9;
                }

                .details strong {
                    color: #34465a;
                }

                .divider {
                    border-top: 1px dashed #ccd5df;
                    margin: 18px 0;
                }

                .product-row {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    font-size: 13px;
                    padding: 8px 0;
                }

                .total-box {
                    background: #edf4fb;
                    border-radius: 9px;
                    padding: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                }

                .total-label {
                    font-size: 14px;
                    font-weight: bold;
                }

                .total-value {
                    color: #2563a6;
                    font-size: 22px;
                    font-weight: bold;
                }

                .thanks {
                    text-align: center;
                    color: #687789;
                    font-size: 13px;
                    margin-top: 25px;
                    line-height: 1.6;
                }

                .print-button {
                    display: block;
                    width: 100%;
                    background: #2563a6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 14px;
                    margin-top: 25px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .print-button:hover {
                    background: #194c82;
                }
.pdf-button {
    display: block;
    width: 100%;
    background: #687789;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 14px;
    margin-top: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
}

.pdf-button:hover {

}
    background: #48586b;
}
                @media print {
                    body {
                        background: white;
                        padding: 0;
                    }

                    .receipt {
                        box-shadow: none;
                        border-radius: 0;
                        margin: 0 auto;
                    }

  .print-button,
.pdf-button {
    display: none;
}
                }
            </style>
        </head>

        <body>
            <div class="receipt">

                <div class="header">
                    <h1 class="logo">TIKORA</h1>
                    <p class="slogan">CADA VENTA, EN ORDEN.</p>

                    <div class="business-info">
                        <strong>${safe(businessSettings.name || "Mi negocio")}</strong><br>
                        ${safe(businessSettings.phone || "")}<br>
                        ${safe(businessSettings.address || "")}
                    </div>
                </div>

                <h2 class="title">RECIBO DE VENTA</h2>

                <div class="number">
                    ${safe(sale.number)}
                </div>

                <div class="section-title">INFORMACIÓN DE LA VENTA</div>

                <div class="details">
                    <strong>Fecha:</strong> ${safe(sale.date)}<br>
                    <strong>Cliente:</strong> ${safe(sale.customer)}
                </div>

                <div class="divider"></div>

                <div class="section-title">DETALLE DEL PRODUCTO</div>

                <div class="product-row">
                    <strong>Producto</strong>
                    <strong>${safe(sale.product)}</strong>
                </div>

                <div class="product-row">
                    <span>Cantidad</span>
                    <strong>${safe(sale.quantity)}</strong>
                </div>

                <div class="product-row">
                    <span>Precio unitario</span>
                    <strong>${formatMoney(sale.price)}</strong>
                </div>

                <div class="divider"></div>

                <div class="total-box">
                    <span class="total-label">TOTAL A PAGAR</span>
                    <span class="total-value">${formatMoney(sale.total)}</span>
                </div>

                <div class="thanks">
                    ${safe(businessSettings.message || "¡Gracias por tu compra!")}
                    <br>
                    <strong>¡Esperamos verte pronto!</strong>
                </div>

<div class="receipt-buttons">
    <button class="print-button" onclick="window.print()">
        IMPRIMIR RECIBO
    </button>

    <button class="pdf-button" onclick="window.print()">
        DESCARGAR PDF
    </button>

</div>

            </div>
        </body>
        </html>
    `);

    receiptWindow.document.close();

}

// Registrar venta
saleForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const customer = document.getElementById("customerName").value.trim();
    const product = document.getElementById("productName").value.trim();
    const quantity = Number(productQuantity.value);
    const price = Number(productPrice.value);

    if (!customer || !product || quantity < 1 || price < 0) {
        alert("Por favor revisa los datos de la venta.");
        return;
    }

    const now = new Date();
    const total = quantity * price;

    const sale = {
        number: "REC-" + String(Date.now()).slice(-6),
        customer,
        product,
        quantity,
        price,
        total,
        date: now.toLocaleDateString("es-CO"),
        dateISO: now.toISOString()
    };

    sales.push(sale);

    refreshApp();
generateReceipt(sale);
    saleModal.style.display = "none";
    saleForm.reset();
    calculateTotal();

    alert("¡Recibo registrado y guardado correctamente!");
});

// Cargar ventas guardadas al abrir la página
renderSales();
updateStats();
calculateTotal();

