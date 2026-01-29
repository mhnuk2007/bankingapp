// UserResponse.java
package com.bank.bankbackend.user.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String email,
        String role,
        Boolean isEnabled
) {}
