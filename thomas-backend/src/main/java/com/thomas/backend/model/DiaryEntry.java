package com.thomas.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "diary_entries")
public class DiaryEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String userId; // foreign key mapping to the User

    private String date;
    private String time;
    private Integer intensity;
    
    @ElementCollection
    private List<String> symptoms;
    
    private String medication;
    private String notes;
}
