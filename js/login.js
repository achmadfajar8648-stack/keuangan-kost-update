const ADMIN_USER = "admin";
const ADMIN_PASS = "fajar123";

const form = document.getElementById("login-form");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem("isAdminLoggedIn", "true");
        window.location.href = "admin.html";
    } else {
        alert("Username atau password salah!");
    }
});
