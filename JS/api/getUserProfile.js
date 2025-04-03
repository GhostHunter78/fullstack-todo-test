export async function getUserProfile() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found. User may not be authenticated.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        console.log("user:", data);

        const greetingToUser = document.getElementById("greeting-to-user");
        greetingToUser.innerHTML = `
        <h3>Hello, ${data.username} ☺</h3>
        `;
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
}

document.addEventListener("DOMContentLoaded", getUserProfile);
