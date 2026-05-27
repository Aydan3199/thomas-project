package com.thomas.backend.controller;

import com.thomas.backend.model.User;
import com.thomas.backend.model.PatientTracking;
import com.thomas.backend.repository.UserRepository;
import com.thomas.backend.repository.DiaryEntryRepository;
import com.thomas.backend.repository.PatientTrackingRepository;
import com.thomas.backend.repository.QuestionnaireResponseRepository;
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
    private final QuestionnaireResponseRepository questionnaireResponseRepository;

    public CaseManagerController(UserRepository userRepository, DiaryEntryRepository diaryRepository, PatientTrackingRepository trackingRepository, QuestionnaireResponseRepository questionnaireResponseRepository) {
        this.userRepository = userRepository;
        this.diaryRepository = diaryRepository;
        this.trackingRepository = trackingRepository;
        this.questionnaireResponseRepository = questionnaireResponseRepository;
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

            // Get actual latest MIDAS score
            Optional<com.thomas.backend.model.QuestionnaireResponse> latestMidas = questionnaireResponseRepository
                .findTopByPatientIdAndQuestionnaireIdOrderByCompletedAtDesc(p.getId(), "midas");
            int midasScore = latestMidas.map(com.thomas.backend.model.QuestionnaireResponse::getScore).orElse(0);

            // Dynamic risk factors based on actual data
            List<String> riskFactors = new ArrayList<>();
            if (headacheDays >= 10) {
                riskFactors.add("頭痛天數過多");
            }
            if (midasScore > 20) {
                riskFactors.add("MIDAS Grade IV");
            } else if (midasScore > 10) {
                riskFactors.add("MIDAS Grade III");
            }
            
            // Check BDI (beck depression)
            Optional<com.thomas.backend.model.QuestionnaireResponse> bdi = questionnaireResponseRepository
                .findTopByPatientIdAndQuestionnaireIdOrderByCompletedAtDesc(p.getId(), "bdi");
            if (bdi.isPresent() && bdi.get().getScore() > 19) {
                riskFactors.add("憂鬱評分偏高");
            }
            
            // Check PSQI (sleep quality)
            Optional<com.thomas.backend.model.QuestionnaireResponse> psqi = questionnaireResponseRepository
                .findTopByPatientIdAndQuestionnaireIdOrderByCompletedAtDesc(p.getId(), "psqi");
            if (psqi.isPresent() && psqi.get().getScore() > 5) {
                riskFactors.add("睡眠品質不佳");
            }
            
            // Check PSS (stress scale)
            Optional<com.thomas.backend.model.QuestionnaireResponse> pss = questionnaireResponseRepository
                .findTopByPatientIdAndQuestionnaireIdOrderByCompletedAtDesc(p.getId(), "pss");
            if (pss.isPresent() && pss.get().getScore() > 13) {
                riskFactors.add("壓力指數高");
            }

            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("age", p.getAge() != null ? p.getAge() : 42); 
            map.put("phone", p.getPhone() != null ? p.getPhone() : "未提供");
            map.put("email", p.getEmail() != null ? p.getEmail() : (p.getName() + "@test.com"));
            map.put("midasScore", midasScore); 
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
