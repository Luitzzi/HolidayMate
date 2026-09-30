package de.luisgerlinger.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = CategoryBE.tableName,
        uniqueConstraints = @UniqueConstraint(columnNames = {"name"}))
@Getter
@Setter
public class CategoryBE {
    public static final String tableName = "category";

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

}
