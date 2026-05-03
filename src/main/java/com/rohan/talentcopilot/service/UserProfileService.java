package com.rohan.talentcopilot.service;

import com.rohan.talentcopilot.dto.CreateUserProfileRequest;
import com.rohan.talentcopilot.dto.UpdateUserProfileRequest;
import com.rohan.talentcopilot.model.UserProfile;
import com.rohan.talentcopilot.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import com.rohan.talentcopilot.exception.ProfileNotFoundException;
import java.util.List;
import com.rohan.talentcopilot.exception.DuplicateEmailException;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public UserProfile createProfile(CreateUserProfileRequest request) {
        if (userProfileRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already in use");
        }
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

    public List<UserProfile> getAllProfiles() {
        return userProfileRepository.findAll();
    }

    //To update user profile
    public UserProfile updateProfile(Long id, UpdateUserProfileRequest request) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));

        profile.setFullName(request.getFullName());
        profile.setEmail(request.getEmail());
        profile.setVisaType(request.getVisaType());
        profile.setGraduationDate(request.getGraduationDate());
        profile.setTargetRole(request.getTargetRole());

        return userProfileRepository.save(profile);
    }

    //To delete user profile
    public void deleteProfile(Long id) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));

        userProfileRepository.delete(profile);
    }

}