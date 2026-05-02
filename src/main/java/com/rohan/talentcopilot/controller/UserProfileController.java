package com.rohan.talentcopilot.controller;

import com.rohan.talentcopilot.dto.CreateUserProfileRequest;
import com.rohan.talentcopilot.model.UserProfile;
import com.rohan.talentcopilot.service.UserProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @PostMapping
    public UserProfile createProfile(@RequestBody CreateUserProfileRequest request) {
        return userProfileService.createProfile(request);
    }
}