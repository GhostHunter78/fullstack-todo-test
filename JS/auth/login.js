import { loginUser } from "../api/authApi.js";

export function initLogin() {
    const form = document.getElementById("login-form");
    const message = document.getElementById("message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = form.username.value;
        const password = form.password.value;

        console.log(`This is username: ${username}`);
        console.log(`This is password: ${password}`);

        message.textContent = `Logging in...`;

        try {
            const data = await loginUser(username, password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            message.textContent = "Login successful!";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } catch (err) {
            message.textContent = `Error: ${err.message}`;
        }
    });
}
