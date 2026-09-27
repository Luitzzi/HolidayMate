package de.luisgerlinger.backend.service;

import java.util.UUID;

public class ActivityNotFoundException extends RuntimeException {

    public ActivityNotFoundException(UUID id) {
        super("Activity " + id + " not found");
    }

}
