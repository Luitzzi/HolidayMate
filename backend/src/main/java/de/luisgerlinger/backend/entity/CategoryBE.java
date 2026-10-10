package de.luisgerlinger.backend.entity;

import de.luisgerlinger.backend.service.NameNormalizer;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import jakarta.validation.constraints.Null;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = CategoryBE.tableName)
@Getter
@Setter
public class CategoryBE {
    public static final String tableName = "categories";

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Setter(AccessLevel.NONE)
    @Column(nullable = false, unique = true)
    private String normalizedName;

    @OneToMany(mappedBy = "category")
    private Set<ItemBE> items = new HashSet<>();

    public void setName(String name) {
        this.name = name;
        this.normalizedName = NameNormalizer.normalize(name);
    }
}
