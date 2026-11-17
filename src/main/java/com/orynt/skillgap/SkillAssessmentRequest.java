package com.orynt.skillgap;

import java.util.List;

public class SkillAssessmentRequest {

    private String targetCareer;
    private List<String> existingSkills;

    public SkillAssessmentRequest() {
    }

    public String getTargetCareer() {
        return targetCareer;
    }

    public void setTargetCareer(String targetCareer) {
        this.targetCareer = targetCareer;
    }

    public List<String> getExistingSkills() {
        return existingSkills;
    }

    public void setExistingSkills(List<String> existingSkills) {
        this.existingSkills = existingSkills;
    }
}