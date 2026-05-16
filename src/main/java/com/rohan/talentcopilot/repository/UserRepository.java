package com.rohan.talentcopilot.repository;

import com.rohan.talentcopilot.entity.User;
import com.rohan.talentcopilot.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

}