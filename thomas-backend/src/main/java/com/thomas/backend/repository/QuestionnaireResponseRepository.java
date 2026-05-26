package com.thomas.backend.repository;

import com.thomas.backend.model.QuestionnaireResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface QuestionnaireResponseRepository extends JpaRepository<QuestionnaireResponse, String> {
    List<QuestionnaireResponse> findByPatientId(String patientId);
    Optional<QuestionnaireResponse> findTopByPatientIdAndQuestionnaireIdOrderByCompletedAtDesc(String patientId, String questionnaireId);
}
