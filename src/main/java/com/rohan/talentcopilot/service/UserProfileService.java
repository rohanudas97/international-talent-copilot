package com.rohan.talentcopilot.service;

import com.rohan.talentcopilot.dto.CreateUserProfileRequest;
import com.rohan.talentcopilot.dto.UpdateUserProfileRequest;
import com.rohan.talentcopilot.model.ProfileStatus;
import com.rohan.talentcopilot.model.UserProfile;
import com.rohan.talentcopilot.repository.UserProfileRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.rohan.talentcopilot.exception.ProfileNotFoundException;
import java.util.List;
import com.rohan.talentcopilot.exception.DuplicateEmailException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
        profile.setStatus(ProfileStatus.ACTIVE);
        return userProfileRepository.save(profile);
    }

    public UserProfile getProfileById(Long id) {
        return userProfileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));
    }

    public List<UserProfile> getAllProfiles() {
        return userProfileRepository.findByStatus(ProfileStatus.ACTIVE);
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

    //To get filtered entry
    public List<UserProfile> getProfilesByVisaType(String visaType) {
        return userProfileRepository.findByVisaTypeIgnoreCase(visaType);
    }

    //To search by email
    public UserProfile getProfileByEmail(String email) {
        return userProfileRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with email: " + email));
    }

    //Pagination implementation
    public Page<UserProfile> getProfilesPaginated(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return userProfileRepository.findAll(pageable);
    }

    //filtering profile by visa type paged
    public Page<UserProfile> getProfilesByVisaTypePaged(
            String visaType,
            int page,
            int size,
            String sortBy,
            String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return userProfileRepository.findByVisaTypeIgnoreCase(visaType, pageable);
    }

    //To update profile status
    public UserProfile updateProfileStatus(Long id, ProfileStatus status) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found with id: " + id));

        profile.setStatus(status);

        return userProfileRepository.save(profile);
    }
}