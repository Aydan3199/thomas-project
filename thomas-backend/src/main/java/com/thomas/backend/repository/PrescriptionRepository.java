package com.thomas.backend.repository;

import com.thomas.backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    List<Prescription> findByPatientIdOrderByCreatedAtDesc(String patientId);
}
