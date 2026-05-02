package com.rohan.talentcopilot.service;

import com.rohan.talentcopilot.dto.CreateUserProfileRequest;
import com.rohan.talentcopilot.model.UserProfile;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    public UserProfile createProfile(CreateUserProfileRequest request) {
        UserProfile profile = new UserProfile();

        profile.setId(1L);
        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());
        profile.setVisaType(request.getVisaType());
        profile.setGraduationDate(request.getGraduationDate());
        profile.setTargetRole(request.getTargetRole());

        return profile;
    }
}