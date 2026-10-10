package de.luisgerlinger.backend.service;

import java.util.Locale;

public class NameNormalizer {
    public static String normalize(String name) {
        return name
                .trim()
                .toLowerCase(Locale.ROOT);
    }
}
