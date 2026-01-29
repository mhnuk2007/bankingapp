//package com.bank.bankbackend.common.exception;
//
//import com.bank.bankbackend.common.dto.ApiResponse;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.FieldError;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestControllerAdvice
//@Slf4j
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(
//            ResourceNotFoundException ex) {
//        log.error("Resource not found: {}", ex.getMessage());
//        return ResponseEntity
//            .status(HttpStatus.NOT_FOUND)
//            .body(ApiResponse.error(ex.getMessage()));
//    }
//
//    @ExceptionHandler(BusinessException.class)
//    public ResponseEntity<ApiResponse<Void>> handleBusinessException(
//            BusinessException ex) {
//        log.error("Business exception: {}", ex.getMessage());
//        return ResponseEntity
//            .status(HttpStatus.BAD_REQUEST)
//            .body(ApiResponse.error(ex.getMessage()));
//    }
//
//    @ExceptionHandler(UnauthorizedException.class)
//    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(
//            UnauthorizedException ex) {
//        log.error("Unauthorized: {}", ex.getMessage());
//        return ResponseEntity
//            .status(HttpStatus.UNAUTHORIZED)
//            .body(ApiResponse.error(ex.getMessage()));
//    }
//
//    @ExceptionHandler(InsufficientBalanceException.class)
//    public ResponseEntity<ApiResponse<Void>> handleInsufficientBalance(
//            InsufficientBalanceException ex) {
//        log.error("Insufficient balance: {}", ex.getMessage());
//        return ResponseEntity
//            .status(HttpStatus.BAD_REQUEST)
//            .body(ApiResponse.error(ex.getMessage()));
//    }
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
//            MethodArgumentNotValidException ex) {
//        Map<String, String> errors = new HashMap<>();
//        ex.getBindingResult().getAllErrors().forEach(error -> {
//            String fieldName = ((FieldError) error).getField();
//            String message = error.getDefaultMessage();
//            errors.put(fieldName, message);
//        });
//
//        log.error("Validation errors: {}", errors);
//        return ResponseEntity
//            .status(HttpStatus.BAD_REQUEST)
//            .body(ApiResponse.<Map<String, String>>builder()
//                .success(false)
//                .message("Validation failed")
//                .data(errors)
//                .timestamp(java.time.LocalDateTime.now())
//                .build());
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiResponse<Void>> handleGlobalException(Exception ex) {
//        log.error("Unexpected error", ex);
//        return ResponseEntity
//            .status(HttpStatus.INTERNAL_SERVER_ERROR)
//            .body(ApiResponse.error("An unexpected error occurred"));
//    }
//}