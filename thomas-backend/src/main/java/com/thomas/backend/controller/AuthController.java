package com.thomas.backend.controller;

import com.thomas.backend.model.User;
import com.thomas.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // A helper route to init some default users if needed for testing
    @GetMapping("/init")
    public ResponseEntity<?> initUsers() {
        if (userRepository.count() == 0) {
            User patient = new User();
            patient.setName("patient1");
            patient.setPassword("1234");
            patient.setRole("patient");
            userRepository.save(patient);

            User doctor = new User();
            doctor.setName("doctor1");
            doctor.setPassword("1234");
            doctor.setRole("doctor");
            userRepository.save(doctor);
            
            return ResponseEntity.ok("Dummy initialized");
        }
        return ResponseEntity.ok("Already initialized");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            if (userRepository.findByEmail(user.getEmail().toLowerCase().trim()).isPresent()) {
                return ResponseEntity.status(400).body(Map.of("message", "該 Email 已被註冊"));
            }
        } else {
            if (userRepository.findByName(user.getName()).isPresent()) {
                return ResponseEntity.status(400).body(Map.of("message", "使用者名稱已存在"));
            }
        }
        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String nameOrEmail = creds.get("name");
        String password = creds.get("password");
        
        Optional<User> userOpt = Optional.empty();
        if (nameOrEmail != null && nameOrEmail.contains("@")) {
            userOpt = userRepository.findByEmail(nameOrEmail.toLowerCase().trim());
        }
        if (userOpt.isEmpty() && nameOrEmail != null) {
            userOpt = userRepository.findByName(nameOrEmail.trim());
        }
        
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.status(401).body(Map.of("message", "帳號或密碼不正確"));
    }
}
