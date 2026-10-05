package de.luisgerlinger.backend.repository;

import de.luisgerlinger.backend.entity.CategoryBE;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<CategoryBE, UUID> {

    List<CategoryBE> findAllByOrderByNameAsc();

}
