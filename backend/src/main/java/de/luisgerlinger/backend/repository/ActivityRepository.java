package de.luisgerlinger.backend.repository;

import de.luisgerlinger.backend.entity.ActivityBE;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<ActivityBE, UUID>, PersistFragment<ActivityBE> {

    List<ActivityBE> findAllByOrderByNameAsc();

}
