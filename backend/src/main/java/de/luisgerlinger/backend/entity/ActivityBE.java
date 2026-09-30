package de.luisgerlinger.backend.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = ActivityBE.tableName,
    uniqueConstraints = @UniqueConstraint(columnNames = {"name"}))
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ActivityBE {
    public static final String tableName = "activities";

    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PackedItemBE> packedItems = new HashSet<>();

}
