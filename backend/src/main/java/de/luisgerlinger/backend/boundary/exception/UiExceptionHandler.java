package de.luisgerlinger.backend.boundary.exception;

import de.luisgerlinger.backend.service.ActivityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UiExceptionHandler {

    @ExceptionHandler(ActivityNotFoundException.class)
    public ProblemDetail handleActivityNotFound(ActivityNotFoundException exception) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage());
    }

}
