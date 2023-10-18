
import { generateKeyPairSync } from "crypto";

export class CryptoUtils {

    static generateRSAKeys() {
        return generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem"
            }
        });
    }

}