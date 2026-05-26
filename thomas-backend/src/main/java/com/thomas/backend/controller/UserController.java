package com.thomas.backend.controller;

import com.thomas.backend.model.User;
import com.thomas.backend.repository.UserRepository;
import com.thomas.backend.repository.DiaryEntryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserRepository userRepository;
    private final DiaryEntryRepository diaryRepository;

    public UserController(UserRepository userRepository, DiaryEntryRepository diaryRepository) {
        this.userRepository = userRepository;
        this.diaryRepository = diaryRepository;
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Map<String, Object>>> getPatients() {
        List<User> patients = userRepository.findAll().stream()
            .filter(u -> "patient".equals(u.getRole()))
            .collect(Collectors.toList());

        List<Map<String, Object>> response = patients.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("age", 40); // Base placeholder
            map.put("gender", "未設定"); 
            map.put("lastVisit", "近期"); 
            map.put("midasScore", 0); // Need questionnaire logic to replace this
            
            long headacheDays = diaryRepository.findByUserIdOrderByDateDesc(p.getId()).size();
            map.put("headacheDays", headacheDays);
            
            map.put("riskLevel", headacheDays >= 10 ? "high" : headacheDays >= 5 ? "medium" : "low");
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }
}
