
const newSaleButton = document.getElementById("newSaleButton");
const saleModal = document.getElementById("saleModal");
const closeSaleModal = document.getElementById("closeSaleModal");
const saleForm = document.getElementById("saleForm");

const productQuantity = document.getElementById("productQuantity");
const productPrice = document.getElementById("productPrice");
const saleTotal = document.getElementById("saleTotal");

const receiptsTable = document.getElementById("receiptsTable");

let receiptNumber = 0;
let totalSales = 0;
let totalCustomers = 0;

// ABRIR VENTANA
newSaleButton.addEventListener("click", function () {
    saleModal.style.display = "flex";
});

// CERRAR VENTANA
closeSaleModal.addEventListener("click", function () {
    saleModal.style.display = "none";
});

// CALCULAR TOTAL
function calculateTotal() {
    const quantity = Number(productQuantity.value) || 0;
    const price = Number(productPrice.value) || 0;

    const total = quantity * price;

    saleTotal.textContent = total.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    });
}

productQuantity.addEventListener("input", calculateTotal);
productPrice.addEventListener("input", calculateTotal);

// GUARDAR VENTA
saleForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const customer = document.getElementById("customerName").value.trim();
    const product = document.getElementById("productName").value.trim();
    const quantity = Number(productQuantity.value);
    const price = Number(productPrice.value);
    const total = quantity * price;

    if (!customer || !product || quantity < 1 || price < 0) {
        alert("Por favor revisa los datos de la venta.");
        return;
    }

    receiptNumber++;
    totalSales += total;
    totalCustomers++;

    const date = new Date().toLocaleDateString("es-CO");

    // QUITAR MENSAJE DE TABLA VACÍA
    if (receiptNumber === 1) {
        receiptsTable.innerHTML = "";
    }

    // CREAR FILA
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>#${String(receiptNumber).padStart(4, "0")}</td>
        <td>${date}</td>
        <td></td>
        <td>${total.toLocaleString("es-CO")} COP</td>
        <td>Registrado</td>
    `;

    // Cliente y producto como texto seguro
    row.children[2].textContent = customer + " - " + product;

    receiptsTable.prepend(row);

    // ACTUALIZAR ESTADÍSTICAS
    document.getElementById("receiptCount").textContent = receiptNumber;
    document.getElementById("customerCount").textContent = totalCustomers;
    document.getElementById("todaySales").textContent =
        totalSales.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        });

    document.getElementById("monthSales").textContent =
        totalSales.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        });

    // CERRAR Y LIMPIAR
    saleModal.style.display = "none";
    saleForm.reset();
    calculateTotal();

    alert("¡Recibo registrado correctamente!");
});

