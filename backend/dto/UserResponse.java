package edu.bsit.delgado.dto;

import java.time.LocalDate;

public record UserResponse(Long id, String fullName, String email, String role, LocalDate createdAt) {}
