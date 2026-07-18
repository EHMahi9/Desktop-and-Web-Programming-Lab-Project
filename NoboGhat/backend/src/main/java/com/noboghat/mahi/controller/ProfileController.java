package com.noboghat.mahi.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class ProfileController {

    @GetMapping("/profile")
    public ResponseEntity<Map<String, String>> getUserProfile() {
        // Phase 6 implementation: Fetch the currently authenticated user's profile
        // Requires authentication context (JWT)
        return ResponseEntity.ok(Map.of(
            "message", "Profile endpoint ready. Authentication (JWT) will be implemented in Phase 6.",
            "status", "placeholder"
        ));
    }
}
