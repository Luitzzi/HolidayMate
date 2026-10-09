package de.luisgerlinger.backend.entity;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = ActivityBE.tableName,
    uniqueConstraints = @UniqueConstraint(columnNames = {"name"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ActivityBE {
    public static final String tableName = "activities";

    public ActivityBE(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Setter(AccessLevel.NONE)
    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PackedItemBE> packedItems = new HashSet<>();

    public void addPackedItem(PackedItemBE packedItemBE) {
        packedItems.add(packedItemBE);
        packedItemBE.setActivity(this);
    }

    public boolean removePackedItem(PackedItemBE packedItemBE) {
        boolean wasRemoved = packedItems.remove(packedItemBE);
        if (wasRemoved) {
            packedItemBE.setActivity(null);
            return true;
        }
        return false;
    }

    public Set<PackedItemBE> getPackedItems() {
        return Collections.unmodifiableSet(packedItems);
    }
}
