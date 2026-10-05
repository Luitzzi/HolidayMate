package de.luisgerlinger.backend.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = PackedItemBE.tableName)
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PackedItemBE {
    public static final String tableName = "packedItems";

    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    @Nullable
    private UUID id;

    private int amount;

    private PackingCondition packingCondition;

    @ManyToOne(optional = false)
    @JoinColumn(name = "activity_id")
    private ActivityBE activity;

    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id")
    private ItemBE ofItem;

}
