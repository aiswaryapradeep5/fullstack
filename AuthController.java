package com.example.studyplanner.controller;

import com.example.studyplanner.dto.AuthRequest;
import com.example.studyplanner.model.User;
import com.example.studyplanner.repository.UserRepository;
import com.example.studyplanner.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Register
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody AuthRequest request) {
        Map<String, String> response = new HashMap<>();

        if (userRepository.existsByUsername(request.getUsername())) {
            response.put("error", "Username already exists!");
            return ResponseEntity.badRequest().body(response);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            response.put("error", "Email already exists!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest request) {
        Map<String, String> response = new HashMap<>();

        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isEmpty() ||
            !passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            response.put("error", "Invalid username or password!");
            return ResponseEntity.badRequest().body(response);
        }

        String token = jwtUtil.generateToken(request.getUsername());
        response.put("token", token);
        response.put("username", request.getUsername());
        return ResponseEntity.ok(response);
    }
}