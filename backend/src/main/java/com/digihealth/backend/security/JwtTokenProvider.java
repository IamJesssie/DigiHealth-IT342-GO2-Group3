package com.digihealth.backend.security;

import com.digihealth.backend.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

/**
 * JwtTokenProvider using the modern jjwt signing/validation APIs.
 * This removes deprecation warnings and provides a single source for:
 * - generating tokens from User
 * - extracting user id
 * - validating token integrity/expiry
 */
@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private int jwtExpirationInMs;

    private Key signingKey;

    private Key getSigningKey() {
        if (signingKey != null) {
            return signingKey;
        }

        logger.debug("Initializing JWT signing key...");
        logger.debug("JWT secret from config: {}", jwtSecret != null && !jwtSecret.isBlank() ? "Present (length=" + jwtSecret.length() + ")" : "EMPTY/NULL");

        // Prefer configured secret if provided
        if (jwtSecret != null && !jwtSecret.isBlank()) {
            byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);

            // HS512 requires key size >= 512 bits (64 bytes).
            if (keyBytes.length < 64) {
                logger.debug("JWT secret too short ({}), deriving with SHA-512", keyBytes.length);
                try {
                    MessageDigest sha512 = MessageDigest.getInstance("SHA-512");
                    byte[] digest = sha512.digest(keyBytes); // 64 bytes
                    signingKey = Keys.hmacShaKeyFor(digest);
                } catch (NoSuchAlgorithmException e) {
                    throw new IllegalStateException("SHA-512 not available for JWT key derivation", e);
                }
            } else {
                logger.debug("Using JWT secret directly (length >= 64)");
                signingKey = Keys.hmacShaKeyFor(keyBytes);
            }

            return signingKey;
        }

        // Fallback: generate a secure random HS512 key if none configured
        logger.warn("No JWT secret configured, generating random key (tokens will be invalidated on restart!)");
        signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        return signingKey;
    }

    public String generateTokenFromUser(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            logger.debug("Validating JWT token: {}", authToken.substring(0, Math.min(30, authToken.length())) + "...");
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(authToken);
            logger.debug("JWT token validation SUCCESS");
            return true;
        } catch (io.jsonwebtoken.MalformedJwtException ex) {
            logger.error("Invalid JWT token - Malformed: {}", ex.getMessage());
        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            logger.error("Invalid JWT token - Expired: {}", ex.getMessage());
        } catch (io.jsonwebtoken.UnsupportedJwtException ex) {
            logger.error("Invalid JWT token - Unsupported: {}", ex.getMessage());
        } catch (io.jsonwebtoken.SignatureException ex) {
            logger.error("Invalid JWT token - Signature validation failed: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("Invalid JWT token - Illegal argument: {}", ex.getMessage());
        } catch (Exception ex) {
            logger.error("Invalid JWT token - Unknown error: {}", ex.getMessage(), ex);
        }
        return false;
    }
}
