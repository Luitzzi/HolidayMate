package de.luisgerlinger.backend.repository;

import de.luisgerlinger.backend.entity.CategoryBE;
import de.luisgerlinger.backend.entity.ItemBE;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<ItemBE, UUID> {

    Optional<ItemBE> findByNameIgnoreCaseAndCategory(String name, CategoryBE category);

}
