package de.luisgerlinger.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = ItemBE.tableName,
        uniqueConstraints = @UniqueConstraint(columnNames = {"name", "category_id"}))
@Getter
@Setter
@RequiredArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ItemBE {
    public static final String tableName = "item";

    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private CategoryBE category;

    private PackingCondition itemCondition;

    @OneToMany(mappedBy = "item")
    private Set<PackedItemBE> packedItems = new HashSet<>();

}
