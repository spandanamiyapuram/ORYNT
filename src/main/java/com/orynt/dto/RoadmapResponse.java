package com.orynt.dto;

public class RoadmapResponse {

    private Long id;
    private String targetCareer;
    private String skillName;
    private String description;
    private String duration;
    private String priority;
    private boolean completed;

    public RoadmapResponse() {
    }

    public RoadmapResponse(
            Long id,
            String targetCareer,
            String skillName,
            String description,
            String duration,
            String priority,
            boolean completed) {

        this.id = id;
        this.targetCareer = targetCareer;
        this.skillName = skillName;
        this.description = description;
        this.duration = duration;
        this.priority = priority;
        this.completed = completed;
    }

    public Long getId() {
        return id;
    }

    public String getTargetCareer() {
        return targetCareer;
    }

    public String getSkillName() {
        return skillName;
    }

    public String getDescription() {
        return description;
    }

    public String getDuration() {
        return duration;
    }

    public String getPriority() {
        return priority;
    }

    public boolean isCompleted() {
        return completed;
    }
}