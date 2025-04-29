export const fetchContactsByEmail = async (email: string) => {
  try {
    const response = await fetch(
      `https://api.systeme.io/api/contacts?email=${email}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-Key": process.env.SYSTEME_IO_API_KEY as string,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.items[0] || null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Failed to fetch contacts:", error.message);
    } else {
      console.error("Failed to fetch contacts: An unknown error occurred");
    }
    return null;
  }
};
