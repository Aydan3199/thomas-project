package com.thomas.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "prescriptions")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String doctorId;
    private String patientId;

    @Column(columnDefinition = "TEXT")
    private String medicationDetails;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    private LocalDateTime createdAt = LocalDateTime.now();
}
