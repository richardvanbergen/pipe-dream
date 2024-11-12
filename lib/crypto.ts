export function seedToHash(seed: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(seed));
}

export function byteGenerator(startHash: ArrayBuffer, minHashLength: number) {
  let hash = startHash;

  return async (numberOfBytes: number) => {
    if (hash.byteLength <= minHashLength) {
      hash = await crypto.subtle.digest("SHA-256", hash);
    }

    const byte = new Uint8Array(hash).slice(0, numberOfBytes);
    hash = hash.slice(numberOfBytes);
    return byte;
  };
}
