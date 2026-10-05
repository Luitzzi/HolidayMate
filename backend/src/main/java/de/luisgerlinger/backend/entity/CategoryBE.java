package de.luisgerlinger.backend.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
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
    @Nullable
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

}
