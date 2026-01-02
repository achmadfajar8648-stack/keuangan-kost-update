document.addEventListener("DOMContentLoaded", function () {

    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }

    const table = document.getElementById("admin-table");
    const form = document.getElementById("transaction-form");

    const incomeEl = document.getElementById("income");
    const expenseEl = document.getElementById("expense");
    const balanceEl = document.getElementById("balance");

    const dashboardSection = document.getElementById("dashboard");
    const transactionsSection = document.getElementById("transactions");

    const dateInput = document.getElementById("date");
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount");
    const typeInput = document.getElementById("type");

    let transactions = [];
    let editId = null;

    // Format nominal
    amountInput.addEventListener("input", function () {
        const cursor = this.selectionStart;
        const raw = this.value.replace(/\D/g, "");
        if (!raw) return this.value = "";
        const formatted = formatNumber(raw);
        const diff = formatted.length - this.value.length;
        this.value = formatted;
        this.setSelectionRange(cursor + diff, cursor + diff);
    });

    // Realtime Firestore
    db.collection("transactions")
        .orderBy("createdAt", "desc")
        .onSnapshot(snapshot => {
            transactions = [];
            snapshot.forEach(doc => {
                transactions.push({ id: doc.id, ...doc.data() });
            });
            render();
        });

    function render() {
        table.innerHTML = "";

        const summary = calculateSummary(transactions);
        incomeEl.textContent = formatNumber(summary.income);
        expenseEl.textContent = formatNumber(summary.expense);
        balanceEl.textContent = formatNumber(summary.balance);

        transactions.forEach(t => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td>${formatNumber(t.amount)}</td>
                <td>${t.type}</td>
                <td>
                    <button onclick="editTx('${t.id}')">✏️</button>
                    <button onclick="deleteTx('${t.id}')">❌</button>
                </td>
            `;
            table.appendChild(row);
        });
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            date: dateInput.value,
            description: descriptionInput.value,
            amount: Number(amountInput.value.replace(/\./g, "")),
            type: typeInput.value,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (editId) {
            await db.collection("transactions").doc(editId).update(data);
            editId = null;
        } else {
            await db.collection("transactions").add(data);
        }

        form.reset();
    });

    window.editTx = function (id) {
        const t = transactions.find(x => x.id === id);
        if (!t) return;

        dateInput.value = t.date;
        descriptionInput.value = t.description;
        amountInput.value = formatNumber(t.amount);
        typeInput.value = t.type;

        editId = id;
    };

    window.deleteTx = async function (id) {
        if (confirm("Hapus data?")) {
            await db.collection("transactions").doc(id).delete();
        }
    };

    window.showDashboard = function () {
        dashboardSection.style.display = "block";
        transactionsSection.style.display = "none";
    };

    window.showTransactions = function () {
        dashboardSection.style.display = "none";
        transactionsSection.style.display = "block";
    };

    window.logout = function () {
        localStorage.removeItem("isAdminLoggedIn");
        window.location.href = "login.html";
    };

});
