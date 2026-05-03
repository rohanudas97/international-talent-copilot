package com.rohan.talentcopilot.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import com.rohan.talentcopilot.exception.DuplicateEmailException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationErrors(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );

        return errors;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ProfileNotFoundException.class)
    public Map<String, String> handleProfileNotFound(ProfileNotFoundException exception) {
        Map<String, String> error = new HashMap<>();
        error.put("message", exception.getMessage());
        return error;
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(DuplicateEmailException.class)
    public Map<String, String> handleDuplicateEmail(DuplicateEmailException exception) {
        Map<String, String> error = new HashMap<>();
        error.put("message", exception.getMessage());
        return error;
    }
}