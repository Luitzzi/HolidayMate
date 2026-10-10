package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.entity.ItemBE;
import de.luisgerlinger.backend.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ItemBA {

    private final ItemRepository itemRepository;

    public Collection<ItemBE> createAll(Collection<ItemBE> items) {
        return itemRepository.persistAll(items);
    }

}
