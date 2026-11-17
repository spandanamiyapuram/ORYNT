package com.orynt.skillgap;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.orynt.entity.User;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "skill_assessments")
public class SkillAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String targetCareer;

    @ElementCollection
    @CollectionTable(
        name = "assessment_existing_skills",
        joinColumns = @JoinColumn(name = "assessment_id")
    )
    @Column(name = "skill")
    private List<String> existingSkills = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
        name = "assessment_missing_skills",
        joinColumns = @JoinColumn(name = "assessment_id")
    )
    @Column(name = "skill")
    private List<String> missingSkills = new ArrayList<>();

    private double matchPercentage;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public SkillAssessment() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}