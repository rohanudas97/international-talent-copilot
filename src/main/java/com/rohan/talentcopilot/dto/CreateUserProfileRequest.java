package com.rohan.talentcopilot.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateUserProfileRequest {

    private String fullName;
    private String email;
    private String visaType;
    private LocalDate graduationDate;
    private String targetRole;
}