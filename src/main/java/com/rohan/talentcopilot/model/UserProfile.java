package com.rohan.talentcopilot.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.time.LocalDate;
import jakarta.persistence.Column;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import com.rohan.talentcopilot.model.ProfileStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String visaType;
    private LocalDate graduationDate;
    private String targetRole;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private ProfileStatus status;
}