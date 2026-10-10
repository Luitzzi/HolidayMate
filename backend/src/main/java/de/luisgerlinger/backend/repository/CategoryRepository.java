package de.luisgerlinger.backend.repository;

import de.luisgerlinger.backend.entity.CategoryBE;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<CategoryBE, UUID>, PersistFragment<CategoryBE> {

    List<CategoryBE> findAllByOrderByNameAsc();

    // Use CategoryBA#findByNormalizedName instead
    private void findByName(String name) {}

    Optional<CategoryBE> findByNormalizedName(String normalizedName);

}
