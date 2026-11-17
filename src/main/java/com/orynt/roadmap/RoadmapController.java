package com.orynt.roadmap;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orynt.dto.RoadmapResponse;
import com.orynt.service.RoadmapService;

@RestController
@RequestMapping("/api/orynt/roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    public RoadmapController(RoadmapService roadmapService) {
        this.roadmapService = roadmapService;
    }

    // Get all roadmaps for logged-in user
    @GetMapping
    public List<RoadmapResponse> getAllRoadmaps(
            Principal principal) {

        return roadmapService.getAllRoadmaps(
                principal.getName());
    }

    // Get roadmap for a specific career
    @GetMapping("/career/{career}")
    public List<RoadmapResponse> getRoadmapByCareer(
            @PathVariable String career,
            Principal principal) {

        return roadmapService.getRoadmapByCareer(
                principal.getName(), career);
    }

    // Add a roadmap
    @PostMapping
    public RoadmapResponse addRoadmap(
            @RequestBody Roadmap roadmap,
            Principal principal) {

        return roadmapService.addRoadmap(
                roadmap, principal.getName());
    }

    // Update a roadmap
    @PutMapping("/{id}")
    public RoadmapResponse updateRoadmap(
            @PathVariable Long id,
            @RequestBody Roadmap roadmap,
            Principal principal) {

        return roadmapService.updateRoadmap(
                id, roadmap, principal.getName());
    }

    // Delete a roadmap
    @DeleteMapping("/{id}")
    public String deleteRoadmap(
            @PathVariable Long id,
            Principal principal) {

        roadmapService.deleteRoadmap(
                id, principal.getName());

        return "Roadmap deleted successfully";
    }
}