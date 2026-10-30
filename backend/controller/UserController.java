package edu.bsit.delgado.controller;

import edu.bsit.delgado.dto.UpdateProfileRequest;
import edu.bsit.delgado.dto.UserResponse;
import edu.bsit.delgado.model.User;
import edu.bsit.delgado.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    private final UserService service;
    public UserController(UserService service) { this.service = service; }

    @PutMapping("/me")
    public UserResponse updateMe(
            @RequestHeader(value = "Authorization", required = false) String token,
            @Valid @RequestBody UpdateProfileRequest request) {
        User user = service.authenticate(token);
        return service.updateProfile(user, request);
    }
}
