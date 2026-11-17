package com.orynt.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    // Generate JWT Token
    public String generateToken(String email) {

        Date currentDate = new Date();

        Date expirationDate = new Date(
                currentDate.getTime() + jwtExpiration
        );

        return Jwts.builder()
                .subject(email)
                .issuedAt(currentDate)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();
    }

    // Extract Email from JWT Token
    public String extractEmail(String token) {

        return extractAllClaims(token).getSubject();
    }

    // Validate JWT Token
    public boolean isTokenValid(String token, String email) {

        final String extractedEmail = extractEmail(token);

        return extractedEmail.equals(email)
                && !isTokenExpired(token);
    }

    // Check Token Expiration
    private boolean isTokenExpired(String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    // Extract All Claims
    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Generate Signing Key
    private SecretKey getSigningKey() {

        byte[] keyBytes = secretKey.getBytes(
                StandardCharsets.UTF_8
        );

        return Keys.hmacShaKeyFor(keyBytes);
    }
}