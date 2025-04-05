import { registerUser } from "../api/authApi.js";

export function initRegister() {
  const form = document.getElementById("registration-form");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = form.username.value;
    const password = form.password.value;
    const email = form.email.value;
    const phone = form.phone.value;

    console.log(`This is username: ${username}`);
    console.log(`This is password: ${password}`);
    console.log(`This is email: ${email}`);
    console.log(`This is phone: ${phone}`);

    message.textContent = `Registering...`;

    try {
      const result = await registerUser(username, password, phone, email);

      if (!result) {
        throw new Error("Registration failed");
      }

      message.textContent = "Registration successful!";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } catch (err) {
      message.textContent = `Error: ${err.message}`;
    }
  });
}
