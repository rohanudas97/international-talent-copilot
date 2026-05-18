package com.rohan.talentcopilot.dto;

import java.util.List;

public record ActionPlanResponse(
        String visaType,
        String riskTone,
        String riskLabel,
        ActionItem nextAction,
        ActionMetric primaryDate,
        ActionMetric countdown,
        List<ActionDate> importantDates,
        List<String> checklist,
        List<ActionAlert> alerts,
        List<String> documents
) {
    public record ActionItem(String title, String detail) {
    }

    public record ActionMetric(String label, String value) {
    }

    public record ActionDate(String label, String value, String tone) {
    }

    public record ActionAlert(String title, String detail, String tone) {
    }
}
