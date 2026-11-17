package com.orynt.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orynt.dto.UserResponse;
import com.orynt.dto.UserRegistrationRequest;
import com.orynt.dto.UserLoginRequest;
import com.orynt.dto.LoginResponse;
import com.orynt.service.UserService;

@RestController
@RequestMapping("/api/orynt")
public class OryntController {

    private final UserService userService;

    public OryntController(UserService userService) {
        this.userService = userService;
    }

    // Welcome API
    @GetMapping("/hello")
    public String welcome() {
        return "Welcome to ORYNT! Backend is working successfully.";
    }

    // Get all users
    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    // Register user
    @PostMapping("/register")
    public UserResponse registerUser(
            @RequestBody UserRegistrationRequest request) {
        return userService.registerUser(request);
    }

    // Login user
    @PostMapping("/login")
    public LoginResponse loginUser(
            @RequestBody UserLoginRequest request) {
        return userService.loginUser(request);
    }

    // Update user
    @PutMapping("/users/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UserRegistrationRequest request) {
        return userService.updateUser(id, request);
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "User deleted successfully with ID: " + id;
    }
}