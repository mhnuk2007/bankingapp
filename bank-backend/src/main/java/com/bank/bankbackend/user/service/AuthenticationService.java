package com.bank.bankbackend.user.service;

import com.bank.bankbackend.security.jwt.JwtService;
import com.bank.bankbackend.security.mfa.MfaSessionService;
import com.bank.bankbackend.security.mfa.OtpService;
import com.bank.bankbackend.security.userdetails.UserDetailsImpl;
import com.bank.bankbackend.user.dto.*;
import com.bank.bankbackend.user.entity.User;
import com.bank.bankbackend.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final MfaSessionService mfaSessionService;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            OtpService otpService,
            MfaSessionService mfaSessionService,
            UserDetailsService userDetailsService,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
        this.mfaSessionService = mfaSessionService;
        this.userDetailsService = userDetailsService;
        this.emailService = emailService;
    }

    /**
     * Register new user
     */
    public AuthenticationResponse register(@Valid RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create new user
        User user = new User(
                request.username(),
                request.email(),
                passwordEncoder.encode(request.password())
        );

        userRepository.save(user);

        return AuthenticationResponse.registered("User registered successfully");
    }

    /**
     * Authenticate user with password (Step 1 of MFA)
     */
    public AuthenticationResponse authenticatePassword(@Valid LoginRequest request) {
        // Authenticate with username and password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        // Get user details
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        // Check if MFA is enabled
        if (!user.isMfaEnabled()) {
            // MFA not enabled, return tokens directly
            String accessToken = jwtService.generateToken(userDetails);
            String refreshToken = jwtService.generateRefreshToken(userDetails);

            return AuthenticationResponse.success(
                    accessToken,
                    refreshToken,
                    user.getUsername(),
                    user.getRole()
            );
        }

        // MFA enabled - generate OTP and create session
        String otp = otpService.generateOtp(user.getUsername());
        String sessionId = mfaSessionService.createMfaSession(user.getUsername());

        // Send OTP via email
        emailService.sendOtpEmail(user.getEmail(), otp);

        return AuthenticationResponse.mfaRequired(sessionId);
    }

    /**
     * Verify OTP (Step 2 of MFA)
     */
    public AuthenticationResponse verifyOtp(@Valid VerifyOtpRequest request) {
        // Validate session
        if (!mfaSessionService.isValidSession(request.sessionId())) {
            throw new IllegalArgumentException("Invalid or expired session");
        }

        // Get username from session
        String username = mfaSessionService.getUsernameFromSession(request.sessionId());
        if (username == null) {
            throw new IllegalArgumentException("Session not found");
        }

        // Validate OTP
        if (!otpService.validateOtp(username, request.otp())) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        // Mark MFA as completed
        mfaSessionService.completeMfaSession(request.sessionId());

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        User user = ((UserDetailsImpl) userDetails).getUser();

        // Generate JWT tokens
        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        // Invalidate session
        mfaSessionService.invalidateSession(request.sessionId());

        return AuthenticationResponse.success(
                accessToken,
                refreshToken,
                user.getUsername(),
                user.getRole()
        );
    }

    /**
     * Refresh access token
     */
    public AuthenticationResponse refreshToken(@Valid RefreshTokenRequest request) {
        // Extract username from refresh token
        String username = jwtService.extractUsername(request.refreshToken());

        // Load user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Validate refresh token
        if (!jwtService.isTokenValid(request.refreshToken(), userDetails)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        // Generate new access token
        String accessToken = jwtService.generateToken(userDetails);
        User user = ((UserDetailsImpl) userDetails).getUser();

        return AuthenticationResponse.success(
                accessToken,
                request.refreshToken(),
                user.getUsername(),
                user.getRole()
        );
    }
}