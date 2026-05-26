package com.thomas.backend.controller;

import com.thomas.backend.model.QuestionnaireResponse;
import com.thomas.backend.repository.QuestionnaireResponseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/questionnaires")
@CrossOrigin(origins = "*")
public class QuestionnaireController {
    
    private final QuestionnaireResponseRepository repository;

    public QuestionnaireController(QuestionnaireResponseRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<QuestionnaireResponse>> getByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(repository.findByPatientId(patientId));
    }

    @PostMapping
    public ResponseEntity<QuestionnaireResponse> save(@RequestBody QuestionnaireResponse response) {
        return ResponseEntity.ok(repository.save(response));
    }
}
