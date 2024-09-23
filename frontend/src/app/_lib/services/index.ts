export async function saveTokenAsCookie(token: string) {
  try {
    const response = await fetch("/api/set-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save token. Status: ${response.status}`);
    }

    const data = await response.json();
  } catch (error: any) {
    console.error("Error saving token as cookie:", error.message);
  }
}