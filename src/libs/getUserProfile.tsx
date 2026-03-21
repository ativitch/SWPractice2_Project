export default async function getUserProfile(token: string) {
  const response = await fetch(
    "https://a08-venue-explorer-backend.vercel.app/api/v1/auth/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch profile");
  }

  return data;
}