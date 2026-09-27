package de.luisgerlinger.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = ItemBE.tableName)
@Getter
@Setter
@RequiredArgsConstructor
public class ItemBE {
    public static final String tableName = "item";

    @Id
    @GeneratedValue
    private UUID id;

    private String name;

    @AttributeOverride(name = "name", column = @Column(name = "condition_name"))
    private PackingCondition condition;

    @OneToMany(mappedBy = "item")
    private Set<PackedItemBE> packedItems;

}
