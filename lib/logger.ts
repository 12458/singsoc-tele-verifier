/**
 * Authentication logging
 * Logs are captured by Vercel and viewable in the dashboard
 */

export async function logAuth(username: string): Promise<void> {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    event: "auth_success",
    user: username,
    timestamp,
  }));
}
