package com.thomas.backend.controller;

import com.thomas.backend.model.DiaryEntry;
import com.thomas.backend.repository.DiaryEntryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/diaries")
@CrossOrigin(origins = "*")
public class DiaryController {
    
    private final DiaryEntryRepository repository;

    public DiaryController(DiaryEntryRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DiaryEntry>> getByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(repository.findByUserIdOrderByDateDesc(userId));
    }

    @PostMapping
    public ResponseEntity<DiaryEntry> save(@RequestBody DiaryEntry entry) {
        return ResponseEntity.ok(repository.save(entry));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
