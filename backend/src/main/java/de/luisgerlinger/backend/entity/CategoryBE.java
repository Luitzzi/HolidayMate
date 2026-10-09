package de.luisgerlinger.backend.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = CategoryBE.tableName,
        uniqueConstraints = @UniqueConstraint(columnNames = {"name"}))
@Getter
@Setter
public class CategoryBE {
    public static final String tableName = "categories";

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "category", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Set<ItemBE> items = new HashSet<>();
}
