package com.thomas.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "patient_tracking")
public class PatientTracking {
    @Id
    private String patientId;

    private String status = "pending";
    private String nextAppointment;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private LocalDateTime updatedAt = LocalDateTime.now();
}
