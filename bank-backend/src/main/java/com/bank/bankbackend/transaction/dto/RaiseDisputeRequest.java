package com.bank.bankbackend.transaction.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Raise dispute request
 */
public record RaiseDisputeRequest(
        @NotBlank(message = "Reason is required")
        @Size(max = 500, message = "Reason must not exceed 500 characters")
        String reason
) {}
