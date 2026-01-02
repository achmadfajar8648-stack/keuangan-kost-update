const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const balanceEl = document.getElementById("balance");
const table = document.getElementById("viewer-table");

db.collection("transactions")
  .orderBy("date", "desc")
  .onSnapshot(snapshot => {

    let totalIncome = 0;
    let totalExpense = 0;

    if (table) table.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const amount = Number(data.amount);

      if (data.type === "income") {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }

      if (table) {
        table.innerHTML += `
          <tr>
            <td>${data.date}</td>
            <td>${data.description}</td>
            <td>${formatRupiah(amount)}</td>
            <td>${data.type === "income" ? "Pemasukan" : "Pengeluaran"}</td>
          </tr>
        `;
      }
    });

    const balance = totalIncome - totalExpense;

    incomeEl.textContent = formatRupiah(totalIncome);
    expenseEl.textContent = formatRupiah(totalExpense);
    balanceEl.textContent = formatRupiah(balance);
  });

// Format angka ke Rupiah
function formatRupiah(number) {
  return Number(number).toLocaleString("id-ID");
}
