package com.orynt.skillgap;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orynt.entity.User;

@Service
public class SkillAssessmentService {

    private final SkillAssessmentRepository assessmentRepository;

    public SkillAssessmentService(
            SkillAssessmentRepository assessmentRepository) {
        this.assessmentRepository = assessmentRepository;
    }

    private final List<String> requiredSkills = Arrays.asList(
        "Java",
        "OOP Concepts",
        "Data Structures",
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Spring Boot",
        "MySQL",
        "REST APIs",
        "Git"
    );

    @Transactional
    public SkillAssessment analyzeSkills(
            User user,
            String targetCareer,
            List<String> existingSkills) {

        List<String> userSkills = existingSkills == null
                ? new ArrayList<>()
                : existingSkills;

        List<String> missingSkills = new ArrayList<>();

        for (String skill : requiredSkills) {
            boolean found = userSkills.stream()
                    .anyMatch(existing ->
                        existing.equalsIgnoreCase(skill));

            if (!found) {
                missingSkills.add(skill);
            }
        }

        double matchPercentage =
                ((double) (requiredSkills.size() - missingSkills.size())
                / requiredSkills.size()) * 100;

        SkillAssessment assessment = new SkillAssessment();

        assessment.setUser(user);
        assessment.setTargetCareer(targetCareer);
        assessment.setExistingSkills(userSkills);
        assessment.setMissingSkills(missingSkills);
        assessment.setMatchPercentage(matchPercentage);

        return assessmentRepository.save(assessment);
    }

    public List<SkillAssessment> getUserAssessments(Long userId) {
        return assessmentRepository
                .findByUser_IdOrderByCreatedAtDesc(userId);
    }
}