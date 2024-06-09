import crypto from "crypto";
const algorithm = "aes-256-ctr";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)

function encrypt(text: string) {
  if (ENCRYPTION_KEY) {
    let iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(
      algorithm,
      Buffer.from(ENCRYPTION_KEY, "hex"),
      iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
  }
}

export function decrypt(encryptedText: string, iv: string) {
  if (ENCRYPTION_KEY) {
    let encryptedTextBuffer = Buffer.from(encryptedText, "hex");
    let decipher = crypto.createDecipheriv(
      algorithm,
      Buffer.from(ENCRYPTION_KEY, "hex"),
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
