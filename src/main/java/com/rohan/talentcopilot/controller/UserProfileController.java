package com.rohan.talentcopilot.controller;

import com.rohan.talentcopilot.dto.CreateUserProfileRequest;
import com.rohan.talentcopilot.dto.UpdateUserProfileRequest;
import com.rohan.talentcopilot.model.ProfileStatus;
import com.rohan.talentcopilot.model.UserProfile;
import com.rohan.talentcopilot.service.UserProfileService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    public UserProfile createProfile(@Valid @RequestBody CreateUserProfileRequest request) {
        return userProfileService.createProfile(request);
    }

    @GetMapping("/{id}")
    public UserProfile getProfileById(@PathVariable Long id) {
        return userProfileService.getProfileById(id);
    }

    @GetMapping
    public List<UserProfile> getAllProfiles() {
        return userProfileService.getAllProfiles();
    }

    @PutMapping("/{id}")
    public UserProfile updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        return userProfileService.updateProfile(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProfile(@PathVariable Long id) {
        userProfileService.deleteProfile(id);
    }

    @GetMapping("/visa/{visaType}")
    public List<UserProfile> getProfilesByVisaType(@PathVariable String visaType) {
        return userProfileService.getProfilesByVisaType(visaType);
    }

    @GetMapping("/search")
    public UserProfile getProfileByEmail(@RequestParam String email) {
        return userProfileService.getProfileByEmail(email);
    }

    @GetMapping("/paged")
    public Page<UserProfile> getProfilesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return userProfileService.getProfilesPaginated(page, size, sortBy, direction);
    }

    @GetMapping("/filter")
    public Page<UserProfile> getProfilesByVisaTypePaged(
            @RequestParam String visaType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return userProfileService.getProfilesByVisaTypePaged(visaType, page, size, sortBy, direction);
    }

    @PatchMapping("/{id}/status")
    public UserProfile updateProfileStatus(
            @PathVariable Long id,
            @RequestParam ProfileStatus status
    ) {
        return userProfileService.updateProfileStatus(id, status);
    }

    @GetMapping("/me")
    public UserProfile getMyProfile(@RequestHeader("Authorization") String authHeader) {

        String email = extractEmailFromAuthHeader(authHeader);

        return userProfileService.getMyProfile(email);
    }

    @PostMapping("/me")
    public UserProfile createMyProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CreateUserProfileRequest request
    ) {
        String email = extractEmailFromAuthHeader(authHeader);

        return userProfileService.createMyProfile(email, request);
    }

    private String extractEmailFromAuthHeader(String authHeader) {
        return authHeader.replace("Bearer ", "").trim();
    }
}
