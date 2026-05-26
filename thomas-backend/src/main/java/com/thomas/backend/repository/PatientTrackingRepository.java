package com.thomas.backend.repository;

import com.thomas.backend.model.PatientTracking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientTrackingRepository extends JpaRepository<PatientTracking, String> {
}
