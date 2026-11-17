package com.orynt.roadmap;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {

    // Fetch all roadmaps belonging to a user
    List<Roadmap> findAllByUserEmail(String email);

    // Fetch a particular roadmap item belonging to a user
    Optional<Roadmap> findByIdAndUserEmail(Long id, String email);

    // Fetch roadmap items for a specific career
    List<Roadmap> findAllByUserEmailAndTargetCareer(
            String email,
            String targetCareer
    );

    // Find a roadmap item by user, career and skill
    Optional<Roadmap> findByUserEmailAndTargetCareerAndSkillName(
            String email,
            String targetCareer,
            String skillName
    );
}