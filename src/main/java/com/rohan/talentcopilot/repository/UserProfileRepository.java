package com.rohan.talentcopilot.repository;

import com.rohan.talentcopilot.model.UserProfile;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
public class UserProfileRepository {

    private final Map<Long, UserProfile> profiles = new HashMap<>();

    private Long currentId = 1L;

    public UserProfile save(UserProfile profile) {
        profile.setId(currentId);
        profiles.put(currentId, profile);
        currentId++;
        return profile;
    }

    public UserProfile findById(Long id) {
        return profiles.get(id);
    }
}