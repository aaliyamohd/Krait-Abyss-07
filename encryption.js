import crypto from "crypto";

// The algorithm to use
const ALGORITHM = "aes-256-gcm";

// Derive 32-byte key buffer from process.env.TWO_FACTOR_ENCRYPTION_KEY
// FAIL CLOSED if secret is missing or invalid
function getEncryptionKey() {
  const envKey = process.env.TWO_FACTOR_ENCRYPTION_KEY;
  if (!envKey) {
    throw new Error(
      "[FATAL SECURITY ERROR] TWO_FACTOR_ENCRYPTION_KEY environment variable is not defined. Failing closed.",
    );
  }

  if (/^[0-9a-fA-F]{64}$/.test(envKey)) {
    return Buffer.from(envKey, "hex");
  }
  return crypto.createHash("sha256").update(envKey).digest();
}

/**
 * Encrypts a plain-text string (like a 2FA secret)
 */
export function encryptSecret(plainText) {
  if (!plainText) return "";
  const key = getEncryptionKey();

  // 1. Generate a random 12-byte Initialization Vector (IV)
  const iv = crypto.randomBytes(12);

  // 2. Create the cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  // 3. Encrypt the text
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  // 4. Get the Authentication Tag
  const authTag = cipher.getAuthTag().toString("hex");

  // 5. Return iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts the combined string back into the plain-text secret
 */
export function decryptSecret(encryptedString) {
  if (!encryptedString) return "";
  const key = getEncryptionKey();

  const parts = encryptedString.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format.");
  }

  const [ivHex, authTagHex, encryptedText] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
