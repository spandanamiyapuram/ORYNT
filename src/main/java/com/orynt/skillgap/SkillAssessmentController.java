package com.orynt.skillgap;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.orynt.entity.User;
import com.orynt.repository.UserRepository;

@RestController
@RequestMapping("/api/orynt/skill-gap")
@CrossOrigin(origins = "http://localhost:5174")
public class SkillAssessmentController {

    private final SkillAssessmentService assessmentService;
    private final UserRepository userRepository;

    public SkillAssessmentController(
            SkillAssessmentService assessmentService,
            UserRepository userRepository) {

        this.assessmentService = assessmentService;
        this.userRepository = userRepository;
    }

    @PostMapping("/analyze")
    public ResponseEntity<SkillAssessmentResponse> analyzeSkills(
            @RequestBody SkillAssessmentRequest request,
            Principal principal) {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        SkillAssessment assessment =
                assessmentService.analyzeSkills(
                        user,
                        request.getTargetCareer(),
                        request.getExistingSkills()
                );

        return ResponseEntity.ok(
                new SkillAssessmentResponse(assessment)
        );
    }

    @GetMapping("/history")
    public ResponseEntity<List<SkillAssessmentResponse>> getHistory(
            Principal principal) {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<SkillAssessmentResponse> history =
                assessmentService.getUserAssessments(user.getId())
                        .stream()
                        .map(SkillAssessmentResponse::new)
                        .toList();

        return ResponseEntity.ok(history);
    }
}