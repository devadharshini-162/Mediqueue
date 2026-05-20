package com.mediqueue.mediqueue;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    List<Token> findByCreatedAtBetweenOrderByTokenNumberAsc(
            LocalDateTime start,
            LocalDateTime end);

    Integer countByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end);
}