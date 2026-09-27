package de.luisgerlinger.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = PackedItemBE.tableName)
@Getter
@Setter
public class PackedItemBE {
    public static final String tableName = "packedItem";

    @Id
    @GeneratedValue
    private UUID id;

    private int amount;

    private PackingCondition condition;

    @ManyToOne
    @JoinColumn(name = "activity_id")
    private ActivityBE activity;

    @ManyToOne
    @JoinColumn(name = "item_id")
    private ItemBE item;

}
