const webAppUrl = "https://script.google.com/macros/s/AKfycbzAAcr3je7gjzMIaJYDtLXPjJLVGy7Fxq6hJG_Irf-Pq1pZt6HFyhyvElop1LtGZ9vf8Q/exec"; // Replace with your Google Apps Script Web App URL
const sheetName = new URLSearchParams(window.location.search).get("sheetName");

if (!sheetName) {
    document.getElementById("message").innerText = "No SheetID defined at the end of the url :(";
} else {
    loadPayments();
}

// Tab switching
document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).classList.add("active");

        if (tab.dataset.tab === "payments") loadPayments();
        else if (tab.dataset.tab === "report") loadReport();
        // No load for expenses tab, it’s just a form
    });
});

// Load Payments
function loadPayments() {
    fetch(`${webAppUrl}?sheetName=${sheetName}&action=payments`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("message").innerText = data.error;
                return;
            }
            const tbody = document.getElementById("payment-table");
            tbody.innerHTML = "";
            data.forEach(row => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td data-label="Invoice">${row.invoice}</td>
                    <td data-label="Store">${row.store}</td>
                    <td data-label="Amount">${row.amount}</td>
                    <td data-label="Received">
                        <input type="number" value="${row.received}" min="0" step="1">
                    </td>
                    <td data-label="Mode">
                        <select>
                            <option value="" ${row.mode === "" ? "selected" : ""}>Select</option>
                            <option value="UPI" ${row.mode === "UPI" ? "selected" : ""}>UPI</option>
                            <option value="Cash" ${row.mode === "Cash" ? "selected" : ""}>Cash</option>
                            <option value="Cheque" ${row.mode === "Cheque" ? "selected" : ""}>Cheque</option>
                        </select>
                    </td>
                    <td data-label="Action">
                        <button onclick="updateRow(this, '${row.invoice}')">Update</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            document.getElementById("message").innerText = "Error loading payments.";
            console.error(error);
        });
}

// Update Payment
function updateRow(button, invoice) {
    const row = button.closest("tr");
    const received = row.querySelector("input").value;
    const mode = row.querySelector("select").value;

    fetch(webAppUrl, {
        method: "POST",
        body: new URLSearchParams({ sheetName, invoice, received, mode, action: "updatePayment" }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
    .then(response => response.text())
    .then(text => {
        document.getElementById("message").innerText = text;
        setTimeout(() => document.getElementById("message").innerText = "", 3000);
    })
    .catch(error => {
        document.getElementById("message").innerText = "Error updating data.";
        console.error(error);
    });
}

// Load Report
function loadReport() {
    fetch(`${webAppUrl}?sheetName=${sheetName}&action=report`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("message").innerText = data.error;
                return;
            }
            document.getElementById("report-summary").innerHTML = `
                <p><strong>Cash:</strong> ${data.cash.toFixed(2)}</p>
                <p><strong>Cheque:</strong> ${data.cheque.toFixed(2)}</p>
                <p><strong>UPI:</strong> ${data.upi.toFixed(2)}</p>
                <p><strong>Total:</strong> ${(data.cash + data.cheque + data.upi).toFixed(2)}</p>
            `;
        })
        .catch(error => {
            document.getElementById("message").innerText = "Error loading report.";
            console.error(error);
        });
}

// Handle Expense Form
document.getElementById("expense-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const fuelAmount = document.getElementById("fuel-amount").value;
    const kilometers = document.getElementById("kilometers").value;

    fetch(webAppUrl, {
        method: "POST",
        body: new URLSearchParams({ sheetName, fuelAmount, kilometers, action: "addExpense" }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
    .then(response => response.text())
    .then(text => {
        document.getElementById("message").innerText = text;
        document.getElementById("expense-form").reset();
        setTimeout(() => document.getElementById("message").innerText = "", 3000);
    })
    .catch(error => {
        document.getElementById("message").innerText = "Error logging expense.";
        console.error(error);
    });
});
