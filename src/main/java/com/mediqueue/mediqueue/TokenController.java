package com.mediqueue.mediqueue;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tokens")
@CrossOrigin(origins = "*")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping
    public List<Token> getAllTokens() {
        return tokenService.getAllTokensToday();
    }

    @PostMapping
    public ResponseEntity<Token> registerPatient(@RequestBody Map<String, String> body) {
        String patientName = body.get("patientName");
        String doctorName = body.get("doctorName");
        if (patientName == null || doctorName == null) {
            return ResponseEntity.badRequest().build();
        }
        Token token = tokenService.registerPatient(patientName, doctorName);
        return ResponseEntity.ok(token);
    }

    @PutMapping("/{id}/call")
    public ResponseEntity<Token> callToken(@PathVariable Long id) {
        return ResponseEntity.ok(
                tokenService.updateStatus(id, Token.TokenStatus.CALLED));
    }

    @PutMapping("/{id}/serve")
    public ResponseEntity<Token> serveToken(@PathVariable Long id) {
        return ResponseEntity.ok(
                tokenService.updateStatus(id, Token.TokenStatus.SERVED));
    }

    @PutMapping("/{id}/skip")
    public ResponseEntity<Token> skipToken(@PathVariable Long id) {
        return ResponseEntity.ok(
                tokenService.updateStatus(id, Token.TokenStatus.SKIPPED));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteToken(@PathVariable Long id) {
        tokenService.deleteToken(id);
        return ResponseEntity.noContent().build();
    }
}