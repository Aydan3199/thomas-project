package com.thomas.backend.controller;

import com.thomas.backend.model.User;
import com.thomas.backend.repository.UserRepository;
import com.thomas.backend.repository.DiaryEntryRepository;
import com.thomas.backend.repository.QuestionnaireResponseRepository;
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
    private final QuestionnaireResponseRepository questionnaireResponseRepository;

    public UserController(UserRepository userRepository, DiaryEntryRepository diaryRepository, QuestionnaireResponseRepository questionnaireResponseRepository) {
        this.userRepository = userRepository;
        this.diaryRepository = diaryRepository;
        this.questionnaireResponseRepository = questionnaireResponseRepository;
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
            map.put("age", p.getAge() != null ? p.getAge() : 40); 
            map.put("gender", p.getGender() != null ? p.getGender() : "未設定"); 
            map.put("lastVisit", "近期"); 
            
            // Get actual latest MIDAS score
            Optional<com.thomas.backend.model.QuestionnaireResponse> latestMidas = questionnaireResponseRepository
                .findTopByPatientIdAndQuestionnaireIdOrderByCompletedAtDesc(p.getId(), "midas");
            int midasScore = latestMidas.map(com.thomas.backend.model.QuestionnaireResponse::getScore).orElse(0);
            map.put("midasScore", midasScore);
            
            long headacheDays = diaryRepository.findByUserIdOrderByDateDesc(p.getId()).size();
            map.put("headacheDays", headacheDays);
            
            map.put("riskLevel", headacheDays >= 10 ? "high" : headacheDays >= 5 ? "medium" : "low");
            
            // Questionnaire completion count this month
            List<com.thomas.backend.model.QuestionnaireResponse> patientResponses = questionnaireResponseRepository.findByPatientId(p.getId());
            java.time.LocalDateTime thirtyDaysAgo = java.time.LocalDateTime.now().minusDays(30);
            long completedCount = patientResponses.stream()
                .filter(r -> r.getCompletedAt() != null && r.getCompletedAt().isAfter(thirtyDaysAgo))
                .map(com.thomas.backend.model.QuestionnaireResponse::getQuestionnaireId)
                .distinct()
                .count();
            map.put("completedCount", completedCount);
            
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (updates.containsKey("age")) {
                Object val = updates.get("age");
                if (val instanceof Integer) {
                    user.setAge((Integer) val);
                } else if (val instanceof String) {
                    try {
                        user.setAge(Integer.parseInt((String) val));
                    } catch (Exception e) {}
                }
            }
            if (updates.containsKey("gender")) {
                user.setGender((String) updates.get("gender"));
            }
            if (updates.containsKey("phone")) {
                user.setPhone((String) updates.get("phone"));
            }
            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        }
        return ResponseEntity.notFound().build();
    }
}
