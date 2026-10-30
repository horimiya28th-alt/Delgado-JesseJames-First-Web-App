package edu.bsit.delgado.service;

import edu.bsit.delgado.dto.*;
import edu.bsit.delgado.exception.AuthException;
import edu.bsit.delgado.exception.ForbiddenException;
import edu.bsit.delgado.model.User;
import edu.bsit.delgado.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {
    private final UserRepository repo;
    // Learning-lab session store: token -> user ID. Tokens disappear when backend restarts.
    private final ConcurrentHashMap<String, Long> sessions = new ConcurrentHashMap<>();

    public UserService(UserRepository repo) { this.repo = repo; }

    public UserResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (repo.existsByEmail(email)) throw new IllegalArgumentException("Email already used");
        User user = new User();
        user.setFullName(req.fullName().trim());
        user.setEmail(email);
        user.setPassword(hash(req.password()));
        user.setRole("USER");
        return toResponse(repo.save(user));
    }

    public LoginResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new AuthException("Invalid email or password"));
        if (!user.getPassword().equals(hash(req.password()))) {
            throw new AuthException("Invalid email or password");
        }
        String token = UUID.randomUUID().toString();
        sessions.put(token, user.getId());
        return new LoginResponse(token, toResponse(user));
    }

    public User authenticate(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new AuthException("Please log in");
        }
        String token = authorizationHeader.substring(7).trim();
        Long userId = sessions.get(token);
        if (userId == null) throw new AuthException("Session expired or invalid token");
        return repo.findById(userId).orElseThrow(() -> new AuthException("User no longer exists"));
    }

    public void logout(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new AuthException("Please log in");
        }
        String token = authorizationHeader.substring(7).trim();
        if (sessions.remove(token) == null) throw new AuthException("Session already expired");
    }

    public DashboardResponse dashboard(User user) {
        return new DashboardResponse(user.getFullName(), user.getEmail(),
                user.getRole(), user.getCreatedAt(), repo.count());
    }

    public void requireRole(User user, String role) {
        if (!role.equals(user.getRole())) throw new ForbiddenException("Access denied");
    }

    public List<UserResponse> findAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse updateProfile(User user, UpdateProfileRequest req) {
        user.setFullName(req.fullName().trim());
        return toResponse(repo.save(user));
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(),
                user.getRole(), user.getCreatedAt());
    }

    public String hash(String raw) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is not available", ex);
        }
    }
}
