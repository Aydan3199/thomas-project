package com.thomas.backend.controller;

import com.thomas.backend.model.Prescription;
import com.thomas.backend.repository.PrescriptionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {
    
    private final PrescriptionRepository repository;

    public PrescriptionController(PrescriptionRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getByPatientId(@PathVariable String patientId) {
        return ResponseEntity.ok(repository.findByPatientIdOrderByCreatedAtDesc(patientId));
    }

    @PostMapping
    public ResponseEntity<Prescription> save(@RequestBody Prescription prescription) {
        return ResponseEntity.ok(repository.save(prescription));
    }
}
