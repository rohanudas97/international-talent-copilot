package com.rohan.talentcopilot.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class CreateUserProfileRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String visaType;

    @NotNull
    private LocalDate graduationDate;

    private LocalDate programEndDate;

    @NotBlank
    private String targetRole;
}
