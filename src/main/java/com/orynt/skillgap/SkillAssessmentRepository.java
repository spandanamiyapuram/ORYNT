package com.orynt.skillgap;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SkillAssessmentRepository
        extends JpaRepository<SkillAssessment, Long> {

    List<SkillAssessment> findByUser_IdOrderByCreatedAtDesc(Long userId);
}