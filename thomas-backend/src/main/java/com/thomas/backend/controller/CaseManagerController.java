package com.thomas.backend.controller;

import com.thomas.backend.model.User;
import com.thomas.backend.model.PatientTracking;
import com.thomas.backend.repository.UserRepository;
import com.thomas.backend.repository.DiaryEntryRepository;
import com.thomas.backend.repository.PatientTrackingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/casemanager")
@CrossOrigin(origins = "*")
public class CaseManagerController {
    
    private final UserRepository userRepository;
    private final DiaryEntryRepository diaryRepository;
    private final PatientTrackingRepository trackingRepository;

    public CaseManagerController(UserRepository userRepository, DiaryEntryRepository diaryRepository, PatientTrackingRepository trackingRepository) {
        this.userRepository = userRepository;
        this.diaryRepository = diaryRepository;
        this.trackingRepository = trackingRepository;
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Map<String, Object>>> getHighRiskPatients() {
        List<User> patients = userRepository.findAll().stream()
            .filter(u -> "patient".equals(u.getRole()))
            .collect(Collectors.toList());

        List<Map<String, Object>> response = patients.stream().map(p -> {
            long headacheDays = diaryRepository.findByUserIdOrderByDateDesc(p.getId()).size();
            
            PatientTracking tracking = trackingRepository.findById(p.getId()).orElseGet(() -> {
                PatientTracking t = new PatientTracking();
                t.setPatientId(p.getId());
                t.setStatus("pending");
                t.setNotes("");
                return trackingRepository.save(t);
            });

            List<String> riskFactors = new ArrayList<>();
            if (headacheDays >= 5) riskFactors.add("頭痛天數過多");

            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("age", 42); // Placeholder
            map.put("phone", "未提供");
            map.put("email", p.getName() + "@test.com");
            map.put("midasScore", 0); // Placeholder
            map.put("headacheDays", headacheDays);
            map.put("lastVisit", "近期");
            map.put("nextAppointment", tracking.getNextAppointment());
            map.put("riskFactors", riskFactors);
            map.put("status", tracking.getStatus() != null ? tracking.getStatus() : "pending");
            map.put("notes", tracking.getNotes() == null ? "" : tracking.getNotes());
            
            return map;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/tracking/{patientId}")
    public ResponseEntity<?> updateTracking(@PathVariable String patientId, @RequestBody Map<String, String> payload) {
        PatientTracking t = trackingRepository.findById(patientId).orElseGet(PatientTracking::new);
        t.setPatientId(patientId);
        
        if (payload.containsKey("status")) {
            t.setStatus(payload.get("status"));
        }
        if (payload.containsKey("nextAppointment")) {
            t.setNextAppointment(payload.get("nextAppointment"));
        }
        if (payload.containsKey("notes")) {
            t.setNotes(payload.get("notes"));
        }
        
        trackingRepository.save(t);
        return ResponseEntity.ok(Map.of("message", "Updated successfully"));
    }
}
