package de.luisgerlinger.backend.entity;

import de.luisgerlinger.backend.service.NameNormalizer;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = ActivityBE.tableName)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ActivityBE {
    public static final String tableName = "activities";

    public ActivityBE(UUID id, String name) {
        this.id = id;
        setName(name);
    }

    @Id
    @GeneratedValue
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Setter(AccessLevel.NONE)
    @Column(nullable = false, unique = true)
    private String normalizedName;

    @Setter(AccessLevel.NONE)
    @Getter(AccessLevel.NONE)
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PackedItemBE> packedItems = new HashSet<>();

    public void setName(String name) {
        this.name = name;
        this.normalizedName = NameNormalizer.normalize(name);
    }

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
