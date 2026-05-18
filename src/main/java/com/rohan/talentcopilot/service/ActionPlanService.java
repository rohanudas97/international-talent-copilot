package com.rohan.talentcopilot.service;

import com.rohan.talentcopilot.dto.ActionPlanResponse;
import com.rohan.talentcopilot.exception.ProfileNotFoundException;
import com.rohan.talentcopilot.model.UserProfile;
import com.rohan.talentcopilot.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ActionPlanService {

    private static final DateTimeFormatter DISPLAY_DATE = DateTimeFormatter.ofPattern("MMM d, yyyy");

    private final UserProfileRepository userProfileRepository;

    public ActionPlanService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public ActionPlanResponse getMyActionPlan(String email) {
        UserProfile profile = userProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new ProfileNotFoundException("Profile not found for user: " + email));

        if ("F1".equalsIgnoreCase(profile.getVisaType())) {
            return buildF1ActionPlan(profile);
        }

        return buildComingSoonActionPlan(profile);
    }

    private ActionPlanResponse buildF1ActionPlan(UserProfile profile) {
        LocalDate programEndDate = resolveProgramEndDate(profile);
        LocalDate today = LocalDate.now();

        LocalDate earliestOptFiling = programEndDate == null ? null : programEndDate.minusDays(90);
        LocalDate latestOptFiling = programEndDate == null ? null : programEndDate.plusDays(60);
        long daysUntilProgramEnd = programEndDate == null ? 0 : ChronoUnit.DAYS.between(today, programEndDate);
        long daysUntilOptWindow = earliestOptFiling == null ? 0 : ChronoUnit.DAYS.between(today, earliestOptFiling);

        String riskTone = determineF1RiskTone(programEndDate, daysUntilProgramEnd, daysUntilOptWindow);
        String riskLabel = switch (riskTone) {
            case "amber" -> "Prepare now";
            case "red" -> "Urgent";
            default -> "On track";
        };

        return new ActionPlanResponse(
                "F1",
                riskTone,
                riskLabel,
                new ActionPlanResponse.ActionItem(
                        determineF1NextActionTitle(programEndDate, daysUntilOptWindow),
                        "Your F1 plan is built around your program end date. Keep that date accurate so OPT timing, DSO tasks, and job-search preparation stay aligned."
                ),
                new ActionPlanResponse.ActionMetric("Program End", formatDate(programEndDate)),
                new ActionPlanResponse.ActionMetric(
                        "Days Until Program End",
                        programEndDate == null ? "Set date" : Math.max(daysUntilProgramEnd, 0) + " days"
                ),
                List.of(
                        new ActionPlanResponse.ActionDate("Earliest OPT filing", formatDate(earliestOptFiling), "blue"),
                        new ActionPlanResponse.ActionDate("Program end date", formatDate(programEndDate), "slate"),
                        new ActionPlanResponse.ActionDate("Latest OPT filing", formatDate(latestOptFiling), "amber")
                ),
                List.of(
                        "Confirm your program end date with your DSO",
                        "Prepare passport, I-94, visa copy, and current I-20",
                        "Ask your DSO about the OPT I-20 process",
                        "Update your resume for " + fallback(profile.getTargetRole(), "your target role"),
                        "Create a weekly job search and networking rhythm"
                ),
                List.of(
                        new ActionPlanResponse.ActionAlert(
                                "OPT window depends on your graduation date",
                                "If your program end date changes, your filing dates should be recalculated immediately.",
                                "blue"
                        ),
                        buildF1TimingAlert(programEndDate, daysUntilOptWindow)
                ),
                List.of(
                        "Passport",
                        "I-94",
                        "F1 visa stamp",
                        "Current I-20",
                        "OPT I-20",
                        "Passport-style photos"
                )
        );
    }

    private ActionPlanResponse buildComingSoonActionPlan(UserProfile profile) {
        String visaType = fallback(profile.getVisaType(), "Visa");

        return new ActionPlanResponse(
                visaType,
                "blue",
                "Coming next",
                new ActionPlanResponse.ActionItem(
                        visaType + " action plan is coming next.",
                        "Today we are building the F1 track first. This structure will support OPT, STEM OPT, and H1B with visa-specific fields and deadlines."
                ),
                new ActionPlanResponse.ActionMetric("Current Track", visaType),
                new ActionPlanResponse.ActionMetric("Status", "Profile ready"),
                List.of(
                        new ActionPlanResponse.ActionDate("Track setup", "Coming next", "blue"),
                        new ActionPlanResponse.ActionDate("Visa-specific fields", "Coming next", "slate"),
                        new ActionPlanResponse.ActionDate("Deadline engine", "Coming next", "amber")
                ),
                List.of(
                        "Keep your profile details current",
                        "Confirm your target role",
                        "Add visa-specific dates when this track is enabled"
                ),
                List.of(
                        new ActionPlanResponse.ActionAlert(
                                "F1 is implemented first",
                                "The action plan engine is live, and this visa track will get its own rules next.",
                                "blue"
                        )
                ),
                List.of("Passport", "I-94", "Visa documents")
        );
    }

    private String determineF1RiskTone(LocalDate graduationDate, long daysUntilGraduation, long daysUntilOptWindow) {
        if (graduationDate == null) {
            return "amber";
        }

        if (daysUntilGraduation < 0 || daysUntilOptWindow <= 30) {
            return "red";
        }

        if (daysUntilGraduation <= 120) {
            return "amber";
        }

        return "green";
    }

    private String determineF1NextActionTitle(LocalDate graduationDate, long daysUntilOptWindow) {
        if (graduationDate == null) {
            return "Add your program end date to unlock OPT timing.";
        }

        if (daysUntilOptWindow <= 0) {
            return "Start your OPT filing process with your DSO.";
        }

        if (daysUntilOptWindow <= 30) {
            return "Prepare your OPT materials before the filing window opens.";
        }

        return "Confirm your program end date with your DSO.";
    }

    private ActionPlanResponse.ActionAlert buildF1TimingAlert(LocalDate graduationDate, long daysUntilOptWindow) {
        if (graduationDate == null) {
            return new ActionPlanResponse.ActionAlert(
                    "Program end date missing",
                    "Add your program end date so the app can calculate your OPT filing window.",
                    "amber"
            );
        }

        if (daysUntilOptWindow <= 0) {
            return new ActionPlanResponse.ActionAlert(
                    "OPT filing window is open",
                    "Your calculated OPT filing window has started. Confirm next steps with your DSO.",
                    "red"
            );
        }

        if (daysUntilOptWindow <= 30) {
            return new ActionPlanResponse.ActionAlert(
                    "OPT window opens soon",
                    "Your calculated OPT filing window opens in " + daysUntilOptWindow + " days.",
                    "amber"
            );
        }

        return new ActionPlanResponse.ActionAlert(
                "No urgent F1 deadline detected",
                "Your calculated OPT filing window opens in " + daysUntilOptWindow + " days.",
                "green"
        );
    }

    private String formatDate(LocalDate date) {
        return date == null ? "Not set" : date.format(DISPLAY_DATE);
    }

    private LocalDate resolveProgramEndDate(UserProfile profile) {
        return profile.getProgramEndDate() != null ? profile.getProgramEndDate() : profile.getGraduationDate();
    }

    private String fallback(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
