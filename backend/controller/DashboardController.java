package edu.bsit.delgado.controller;

import edu.bsit.delgado.dto.DashboardResponse;
import edu.bsit.delgado.dto.UserResponse;
import edu.bsit.delgado.model.User;
import edu.bsit.delgado.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
    private final UserService service;
    public DashboardController(UserService service) { this.service = service; }

    @GetMapping
    public DashboardResponse home(@RequestHeader(value = "Authorization", required = false) String token) {
        User user = service.authenticate(token);
        return service.dashboard(user);
    }

    @GetMapping("/users")
    public List<UserResponse> users(@RequestHeader(value = "Authorization", required = false) String token) {
        User user = service.authenticate(token);
        service.requireRole(user, "ADMIN");
        return service.findAll();
    }
}
