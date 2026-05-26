package com.thomas.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "questionnaire_responses")
public class QuestionnaireResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String patientId;
    private String questionnaireId; // e.g. "midas"
    private Integer score;
    
    @Column(columnDefinition = "TEXT")
    private String details; 
    
    private LocalDateTime completedAt = LocalDateTime.now();
}
