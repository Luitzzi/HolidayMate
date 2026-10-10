package de.luisgerlinger.backend.entity;

import de.luisgerlinger.backend.service.NameNormalizer;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = ItemBE.tableName)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemBE {
    public static final String tableName = "items";

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Setter(AccessLevel.NONE)
    @Column(nullable = false, unique = true)
    private String normalizedName;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private CategoryBE category;

    @Nullable
    private PackingCondition itemCondition;

    public void setName(String name) {
        this.name = name;
        this.normalizedName = NameNormalizer.normalize(name);
    }
}
