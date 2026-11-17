package com.orynt.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orynt.dto.RoadmapResponse;
import com.orynt.entity.User;
import com.orynt.repository.UserRepository;
import com.orynt.roadmap.Roadmap;
import com.orynt.roadmap.RoadmapRepository;

@Service
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final UserRepository userRepository;

    public RoadmapService(
            RoadmapRepository roadmapRepository,
            UserRepository userRepository) {

        this.roadmapRepository = roadmapRepository;
        this.userRepository = userRepository;
    }

    // Get all roadmaps belonging to logged-in user
    @Transactional(readOnly = true)
    public List<RoadmapResponse> getAllRoadmaps(String email) {

        return roadmapRepository.findAllByUserEmail(email)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get roadmap for a particular career
    @Transactional(readOnly = true)
    public List<RoadmapResponse> getRoadmapByCareer(
            String email, String targetCareer) {

        return roadmapRepository
                .findAllByUserEmailAndTargetCareer(email, targetCareer)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Add roadmap for logged-in user and career
    @Transactional
    public RoadmapResponse addRoadmap(
            Roadmap roadmap, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (roadmap.getTargetCareer() == null ||
                roadmap.getTargetCareer().isBlank()) {
            throw new IllegalArgumentException(
                    "Target career is required");
        }

        boolean duplicate = roadmapRepository
                .findByUserEmailAndTargetCareerAndSkillName(
                        email,
                        roadmap.getTargetCareer(),
                        roadmap.getSkillName()
                )
                .isPresent();

        if (duplicate) {
            throw new IllegalArgumentException(
                    "This skill already exists in your career roadmap");
        }

        roadmap.setId(null);
        roadmap.setUser(user);

        Roadmap savedRoadmap = roadmapRepository.save(roadmap);

        return convertToResponse(savedRoadmap);
    }

    // Update only the logged-in user's roadmap
    @Transactional
    public RoadmapResponse updateRoadmap(
            Long id, Roadmap updatedRoadmap, String email) {

        Roadmap roadmap = roadmapRepository
                .findByIdAndUserEmail(id, email)
                .orElseThrow(() ->
                        new RuntimeException("Roadmap not found"));

        roadmap.setSkillName(updatedRoadmap.getSkillName());
        roadmap.setDescription(updatedRoadmap.getDescription());
        roadmap.setDuration(updatedRoadmap.getDuration());
        roadmap.setPriority(updatedRoadmap.getPriority());
        roadmap.setCompleted(updatedRoadmap.isCompleted());

        Roadmap savedRoadmap = roadmapRepository.save(roadmap);

        return convertToResponse(savedRoadmap);
    }

    // Delete only the logged-in user's roadmap
    @Transactional
    public void deleteRoadmap(Long id, String email) {

        Roadmap roadmap = roadmapRepository
                .findByIdAndUserEmail(id, email)
                .orElseThrow(() ->
                        new RuntimeException("Roadmap not found"));

        roadmapRepository.delete(roadmap);
    }

    // Convert entity into safe response DTO
    private RoadmapResponse convertToResponse(Roadmap roadmap) {

        return new RoadmapResponse(
                roadmap.getId(),
                roadmap.getTargetCareer(),
                roadmap.getSkillName(),
                roadmap.getDescription(),
                roadmap.getDuration(),
                roadmap.getPriority(),
                roadmap.isCompleted()
        );
    }
}