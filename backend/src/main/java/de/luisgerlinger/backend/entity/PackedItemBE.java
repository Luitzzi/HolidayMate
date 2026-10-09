package de.luisgerlinger.backend.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = PackedItemBE.tableName)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PackedItemBE {
    public static final String tableName = "packedItems";

    @EmbeddedId
    private PackedItemId id = new PackedItemId();

    private int amount;

    @Nullable
    private PackingCondition packingCondition;

    @MapsId("activityId")
    @ManyToOne(optional = false)
    @JoinColumn(name = "activity_id")
    private ActivityBE activity;

    @MapsId("itemId")
    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id")
    private ItemBE ofItem;

}

