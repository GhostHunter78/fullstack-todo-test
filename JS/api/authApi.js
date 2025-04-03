const API_URL = "http://localhost:5000";

export async function loginUser(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error("Failed to login");
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}
