package com.bank.bankbackend.user.dto;

public record MfaSetupResponse(

        boolean enabled,
        String message
) {
    public static MfaSetupResponse success(String message) {
        return new MfaSetupResponse(true, message);
    }
}
