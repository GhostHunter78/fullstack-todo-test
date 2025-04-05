export function logout() {
    const logoutButton = document.getElementById("logout-button");

    logoutButton.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("selectedFilter");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } catch (err) {
            message.textContent = `Error: ${err.message}`;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    logout();
});
