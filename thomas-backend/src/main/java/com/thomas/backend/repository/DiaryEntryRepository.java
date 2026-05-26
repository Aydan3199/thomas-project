package com.thomas.backend.repository;

import com.thomas.backend.model.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, String> {
    List<DiaryEntry> findByUserIdOrderByDateDesc(String userId);
}
