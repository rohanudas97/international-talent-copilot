package com.rohan.talentcopilot.controller;

import com.rohan.talentcopilot.dto.LoginRequest;
import com.rohan.talentcopilot.dto.LoginResponse;
import com.rohan.talentcopilot.dto.SignupRequest;
import com.rohan.talentcopilot.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public String signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
