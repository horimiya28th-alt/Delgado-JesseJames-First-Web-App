package edu.bsit.delgado.config;

import edu.bsit.delgado.model.User;
import edu.bsit.delgado.repository.UserRepository;
import edu.bsit.delgado.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminSeeder {
    @Bean
    CommandLineRunner seedAdmin(UserRepository repo, UserService userService) {
        return args -> {
            String email = "admin@userhub.com";
            if (!repo.existsByEmail(email)) {
                User admin = new User();
                admin.setFullName("UserHub Administrator");
                admin.setEmail(email);
                admin.setPassword(userService.hash("Admin@123"));
                admin.setRole("ADMIN");
                repo.save(admin);
                System.out.println("Default ADMIN account created: " + email);
            }
        };
    }
}
