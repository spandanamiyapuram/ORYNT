package com.orynt.skillgap;

import java.time.LocalDateTime;
import java.util.List;

public class SkillAssessmentResponse {

    private Long id;
    private String targetCareer;
    private List<String> existingSkills;
    private List<String> missingSkills;
    private double matchPercentage;
    private LocalDateTime createdAt;

    public SkillAssessmentResponse() {
    }

    public SkillAssessmentResponse(SkillAssessment assessment) {
        this.id = assessment.getId();
        this.targetCareer = assessment.getTargetCareer();
        this.existingSkills = assessment.getExistingSkills();
        this.missingSkills = assessment.getMissingSkills();
        this.matchPercentage = assessment.getMatchPercentage();
        this.createdAt = assessment.getCreatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getTargetCareer() {
        return targetCareer;
    }

    public List<String> getExistingSkills() {
        return existingSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public double getMatchPercentage() {
        return matchPercentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}