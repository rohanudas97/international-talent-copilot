package com.rohan.talentcopilot.controller;

import com.rohan.talentcopilot.dto.LoginRequest;
import com.rohan.talentcopilot.dto.LoginResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        if ("admin".equals(request.getUsername()) &&
                "admin123".equals(request.getPassword())) {

            return new LoginResponse("mock-jwt-token");
        }

        throw new RuntimeException("Invalid username or password");
    }
}