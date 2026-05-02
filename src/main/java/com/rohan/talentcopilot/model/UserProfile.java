package com.rohan.talentcopilot.model;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserProfile {

    private Long id;
    private String fullName;
    private String email;
    private String visaType;
    private LocalDate graduationDate;
    private String targetRole;
}