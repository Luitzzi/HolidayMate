package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.entity.ItemBE;
import de.luisgerlinger.backend.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemBA {

    private final ItemRepository itemRepository;

    public List<ItemBE> createItems(List<ItemBE> items) {
        boolean invalidItem = items.stream()
                .anyMatch(item -> item.getId() != null);
        if (invalidItem)
            throw new IllegalArgumentException("Items to create must not have an id");

        return itemRepository.saveAll(items);
    }

}
