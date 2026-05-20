package com.mediqueue.mediqueue;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TokenService {

    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    private LocalDateTime startOfDay() {
        return LocalDate.now().atStartOfDay();
    }

    private LocalDateTime endOfDay() {
        return LocalDate.now().atTime(23, 59, 59);
    }

    public List<Token> getAllTokensToday() {
        return tokenRepository.findByCreatedAtBetweenOrderByTokenNumberAsc(
                startOfDay(), endOfDay());
    }

    public Token registerPatient(String patientName, String doctorName) {
        Integer count = tokenRepository.countByCreatedAtBetween(
                startOfDay(), endOfDay());
        Token token = new Token();
        token.setPatientName(patientName);
        token.setDoctorName(doctorName);
        token.setTokenNumber(count + 1);
        return tokenRepository.save(token);
    }

    public Token updateStatus(Long id, Token.TokenStatus status) {
        Token token = tokenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Token not found with id: " + id));
        token.setStatus(status);
        return tokenRepository.save(token);
    }

    public void deleteToken(Long id) {
        tokenRepository.deleteById(id);
    }
}