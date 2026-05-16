package com.rohan.talentcopilot.repository;

import com.rohan.talentcopilot.model.ProfileStatus;
import com.rohan.talentcopilot.model.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    boolean existsByEmail(String email);
    List<UserProfile> findByVisaTypeIgnoreCase(String visaType);
    Optional<UserProfile> findByEmailIgnoreCase(String email);
    Page<UserProfile> findByVisaTypeIgnoreCase(String visaType, Pageable pageable);
    List<UserProfile> findByStatus(ProfileStatus status);
    Optional<UserProfile> findByUserEmail(String email);
}