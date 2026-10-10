package de.luisgerlinger.backend.repository;

import de.luisgerlinger.backend.entity.ItemBE;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ItemRepository extends JpaRepository<ItemBE, UUID>, PersistFragment<ItemBE> {}
