package com.bank.bankbackend.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    /**
     * Send OTP via email
     * In production, integrate with actual email service (SendGrid, AWS SES, etc.)
     */
    public void sendOtpEmail(String email, String otp) {
        // TODO: Integrate with actual email service
        // For now, just log the OTP
        logger.info("===========================================");
        logger.info("SENDING OTP EMAIL");
        logger.info("To: {}", email);
        logger.info("OTP: {}", otp);
        logger.info("OTP will expire in 5 minutes");
        logger.info("===========================================");

        // In production, use this:
        /*
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setTo(email);
            helper.setSubject("Your OTP Code");
            helper.setText(buildOtpEmailContent(otp), true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            logger.error("Failed to send OTP email", e);
            throw new RuntimeException("Failed to send OTP email");
        }
        */
    }

    /**
     * Build HTML email content for OTP
     */
    private String buildOtpEmailContent(String otp) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .otp-code { 
                            font-size: 32px; 
                            font-weight: bold; 
                            color: #007bff; 
                            letter-spacing: 5px;
                            text-align: center;
                            padding: 20px;
                            background-color: #f8f9fa;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>Your One-Time Password (OTP)</h2>
                        <p>Use the following OTP to complete your login:</p>
                        <div class="otp-code">%s</div>
                        <p>This OTP will expire in 5 minutes.</p>
                        <p>If you didn't request this OTP, please ignore this email.</p>
                    </div>
                </body>
                </html>
                """.formatted(otp);
    }

    /**
     * Send welcome email
     */
    public void sendWelcomeEmail(String email, String username) {
        logger.info("Sending welcome email to: {}", email);
        // TODO: Implement welcome email
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String email, String resetToken) {
        logger.info("Sending password reset email to: {}", email);
        // TODO: Implement password reset email
    }
}