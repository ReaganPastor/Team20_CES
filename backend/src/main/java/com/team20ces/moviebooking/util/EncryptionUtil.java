package com.team20ces.moviebooking.util;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;


public class EncryptionUtil {

    private static final String ALGO = "AES";
    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;

    private static final byte[] KEY_BYTES = "replace-with-32-byte-secret-key!".getBytes();
    private static final byte[] IV = new byte[12]; // for dev, static IV; in prod use random IV per card

    private static SecretKeySpec getKey() {
        return new SecretKeySpec(KEY_BYTES, ALGO);
    }

    // Encrypt plaintext card data (card number or CVV)

    public static String encrypt(String input) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, getKey(), new GCMParameterSpec(GCM_TAG_LENGTH, IV));
        byte[] encrypted = cipher.doFinal(input.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    // Decrypts the encrypted string back to plaintext

    public static String decrypt(String encrypted) throws Exception {
        Cipher cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, getKey(), new GCMParameterSpec(GCM_TAG_LENGTH, IV));
        byte[] decoded = Base64.getDecoder().decode(encrypted);
        return new String(cipher.doFinal(decoded));
    }
}