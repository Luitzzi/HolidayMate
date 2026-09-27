package de.luisgerlinger.backend.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class PackingCondition {
    private String name;
    private String trigger;
}
