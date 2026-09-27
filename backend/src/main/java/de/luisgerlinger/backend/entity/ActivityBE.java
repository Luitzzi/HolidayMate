package de.luisgerlinger.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = ActivityBE.tableName)
@Getter
@Setter
public class ActivityBE {
    public static final String tableName = "activity";

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    @OneToMany(mappedBy = "activity")
    private Set<PackedItemBE> packedItems = new HashSet<>();

}
