package de.luisgerlinger.backend.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = ItemBE.tableName,
        uniqueConstraints = @UniqueConstraint(columnNames = {"name"}))
@Getter
@Setter
@RequiredArgsConstructor
public class ItemBE {
    public static final String tableName = "items";

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false, cascade = CascadeType.PERSIST)
    @JoinColumn(name = "category_id")
    private CategoryBE category;

    @Nullable
    private PackingCondition itemCondition;

}
