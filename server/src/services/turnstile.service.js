const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * @param {string} [token] — token từ widget (client)
 * @returns {Promise<boolean>}
 */
async function verifyTurnstileToken(token) {
  const secret = process.env.TURNSTILE_SECRETKEY;
  if (!secret) {
    console.warn("[Turnstile] Thiếu TURNSTILE_SECRETKEY trong .env — từ chối request.");
    return false;
  }
  if (!token || typeof token !== "string") {
    return false;
  }
  try {
    const body = new URLSearchParams();
    body.append("secret", secret);
    body.append("response", token.trim());

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = await res.json();
    if (!json.success) {
      console.warn(
        "[Turnstile] siteverify thất bại:",
        json["error-codes"] || json,
      );
    }
    return json.success === true;
  } catch (e) {
    console.warn("[Turnstile] siteverify error:", e.message);
    return false;
  }
}

module.exports = { verifyTurnstileToken };
