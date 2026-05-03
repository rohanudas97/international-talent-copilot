package com.rohan.talentcopilot.service;

import com.rohan.talentcopilot.dto.CreateUserProfileRequest;
import com.rohan.talentcopilot.model.UserProfile;
import com.rohan.talentcopilot.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import com.rohan.talentcopilot.exception.ProfileNotFoundException;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile createProfile(CreateUserProfileRequest request) {
        UserProfile profile = new UserProfile();

        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());
        profile.setVisaType(request.getVisaType());
        profile.setGraduationDate(request.getGraduationDate());
        profile.setTargetRole(request.getTargetRole());

        return userProfileRepository.save(profile);
    }
    public UserProfile getProfileById(Long id) {
        return userProfileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));
    }
}