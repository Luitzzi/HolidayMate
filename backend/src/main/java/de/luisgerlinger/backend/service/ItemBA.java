package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.boundary.uidto.ItemUiDTO;
import de.luisgerlinger.backend.entity.ItemBE;
import de.luisgerlinger.backend.repository.ItemRepository;
import de.luisgerlinger.backend.service.mapper.ItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ItemBA {

    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;

    public List<ItemUiDTO> getAll() {
        return itemRepository.findAllByOrderByNameAsc().stream()
                .map(itemMapper::toDTO)
                .toList();
    }

    public ItemUiDTO create(ItemUiDTO item) {
        ItemBE created = itemRepository.persist(
                itemMapper.toBE(item));
        return itemMapper.toDTO(created);
    }

    public Collection<ItemBE> createAll(Collection<ItemBE> items) {
        return itemRepository.persistAll(items);
    }

}
