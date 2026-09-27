package de.luisgerlinger.backend.repository;

import de.luisgerlinger.backend.entity.ActivityBE;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<ActivityBE, UUID> {

    @EntityGraph(attributePaths = {"packedItems", "packedItems.item", "packedItems.item.category"})
    List<ActivityBE> findAllByOrderByNameAsc();

}
