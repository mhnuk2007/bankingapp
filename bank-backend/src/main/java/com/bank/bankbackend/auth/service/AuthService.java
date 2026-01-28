package com.bank.bankbackend.auth.service;

import com.bank.bankbackend.auth.dto.RegisterRequest;
import com.bank.bankbackend.auth.entity.User;
import com.bank.bankbackend.auth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    public AuthService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    // Register a new user

    public String registerUser(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(request.password());
        userRepository.save(user);
        return "User registered successfully";



    }
}
