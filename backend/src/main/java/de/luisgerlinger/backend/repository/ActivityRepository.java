package de.luisgerlinger.backend.repository;

import de.luisgerlinger.backend.entity.ActivityBE;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<ActivityBE, UUID> {

    List<ActivityBE> findAllByOrderByNameAsc();

}
