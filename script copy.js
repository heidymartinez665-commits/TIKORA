
function formatMoney(value) {
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

    saleModal.style.display = "none";
    saleForm.reset();
    calculateTotal();

    alert("¡Recibo registrado y guardado correctamente!");
});

// Cargar ventas guardadas al abrir la página
renderSales();
updateStats();
calculateTotal();
}
