import { pbkdf2Sync, timingSafeEqual } from "node:crypto";

function readNetworkByteOrder(buffer: Buffer, offset: number) {
  return buffer.readUInt32BE(offset);
}

export function verifyAspNetIdentityV3Hash(password: string, passwordHash: string) {
  const decoded = Buffer.from(passwordHash, "base64");

  if (decoded.length < 13 || decoded[0] !== 0x01) {
    return false;
  }

  const prf = readNetworkByteOrder(decoded, 1);
  const iterationCount = readNetworkByteOrder(decoded, 5);
  const saltLength = readNetworkByteOrder(decoded, 9);

  if (decoded.length < 13 + saltLength) {
    return false;
  }

  const salt = decoded.subarray(13, 13 + saltLength);
  const expectedSubkey = decoded.subarray(13 + saltLength);

  const digest =
    prf === 0 ? "sha1" : prf === 1 ? "sha256" : prf === 2 ? "sha512" : null;

  if (!digest) {
    return false;
  }

  const actualSubkey = pbkdf2Sync(
    Buffer.from(password, "utf8"),
    salt,
    iterationCount,
    expectedSubkey.length,
    digest
  );

  return timingSafeEqual(actualSubkey, expectedSubkey);
}

export function generateAspNetIdentityV3Hash(password: string) {
  const { randomBytes, pbkdf2Sync } = require("node:crypto");
  const salt = randomBytes(16);
  const iterCount = 10000;
  const subkey = pbkdf2Sync(Buffer.from(password, "utf8"), salt, iterCount, 32, "sha256");

  const output = Buffer.alloc(13 + salt.length + subkey.length);
  output[0] = 0x01; // Version
  output.writeUInt32BE(1, 1); // PRF (SHA256)
  output.writeUInt32BE(iterCount, 5);
  output.writeUInt32BE(salt.length, 9);
  salt.copy(output, 13);
  subkey.copy(output, 13 + salt.length);

  return output.toString("base64");
}
