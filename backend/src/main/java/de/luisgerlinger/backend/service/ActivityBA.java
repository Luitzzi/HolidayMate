package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.boundary.uidto.ActivityUiDTO;
import de.luisgerlinger.backend.boundary.uidto.PackedItemUiDTO;
import de.luisgerlinger.backend.entity.ActivityBE;
import de.luisgerlinger.backend.entity.CategoryBE;
import de.luisgerlinger.backend.entity.ItemBE;
import de.luisgerlinger.backend.entity.PackedItemBE;
import de.luisgerlinger.backend.repository.ActivityRepository;
import de.luisgerlinger.backend.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityBA {

    private final ActivityRepository activityRepository;
    private final ItemRepository itemRepository;
    private final CategoryBA categoryBA;

    @Transactional(readOnly = true)
    public List<ActivityUiDTO> getAll() {
        return activityRepository.findAllByOrderByNameAsc().stream()
                .map(this::toUiDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public ActivityUiDTO get(UUID id) {
        return toUiDTO(findActivity(id));
    }

    @Transactional
    public ActivityUiDTO create(ActivityUiDTO activityUiDTO) {
        ActivityBE activity = new ActivityBE();
        apply(activity, activityUiDTO);
        return toUiDTO(activityRepository.save(activity));
    }

    @Transactional
    public ActivityUiDTO update(UUID id, ActivityUiDTO activityUiDTO) {
        ActivityBE activity = findActivity(id);
        apply(activity, activityUiDTO);
        return toUiDTO(activityRepository.saveAndFlush(activity));
    }

    private ActivityBE findActivity(UUID id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ActivityNotFoundException(id));
    }

    /**
     * Copies the UiDTO onto the entity. Packed items are matched by id:
     * known ids are updated, unknown or missing ids are added, and entries
     * not contained in the UiDTO are removed.
     */
    private void apply(ActivityBE activity, ActivityUiDTO activityUiDTO) {
        activity.setName(activityUiDTO.getName().trim());

        Map<UUID, PackedItemBE> existingById = activity.getPackedItems().stream()
                .collect(Collectors.toMap(PackedItemBE::getId, Function.identity()));

        Set<PackedItemBE> packedItems = new HashSet<>();
        for (PackedItemUiDTO packedItemUiDTO : activityUiDTO.getPackedItems()) {
            PackedItemBE packedItem = packedItemUiDTO.getId() == null
                    ? null
                    : existingById.get(packedItemUiDTO.getId());
            if (packedItem == null) {
                packedItem = new PackedItemBE();
                packedItem.setActivity(activity);
            }
            packedItem.setAmount(packedItemUiDTO.getAmount());
            packedItem.setItem(findOrCreateItem(packedItemUiDTO.getName(), packedItemUiDTO.getCategory()));
            packedItems.add(packedItem);
        }

        activity.getPackedItems().retainAll(packedItems);
        activity.getPackedItems().addAll(packedItems);
    }

    private ItemBE findOrCreateItem(String name, String categoryName) {
        String trimmed = name.trim();
        CategoryBE category = categoryBA.findOrCreate(categoryName);
        return itemRepository.findByNameIgnoreCaseAndCategory(trimmed, category)
                .orElseGet(() -> {
                    ItemBE item = new ItemBE();
                    item.setName(trimmed);
                    item.setCategory(category);
                    return itemRepository.save(item);
                });
    }

    private ActivityUiDTO toUiDTO(ActivityBE activity) {
        ActivityUiDTO activityUiDTO = new ActivityUiDTO();
        activityUiDTO.setId(activity.getId());
        activityUiDTO.setName(activity.getName());
        activityUiDTO.setPackedItems(activity.getPackedItems().stream()
                .map(this::toUiDTO)
                .sorted(Comparator.comparing(PackedItemUiDTO::getCategory)
                        .thenComparing(PackedItemUiDTO::getName))
                .toList());
        return activityUiDTO;
    }

    private PackedItemUiDTO toUiDTO(PackedItemBE packedItem) {
        PackedItemUiDTO packedItemUiDTO = new PackedItemUiDTO();
        packedItemUiDTO.setId(packedItem.getId());
        packedItemUiDTO.setName(packedItem.getItem().getName());
        packedItemUiDTO.setCategory(packedItem.getItem().getCategory().getName());
        packedItemUiDTO.setAmount(packedItem.getAmount());
        return packedItemUiDTO;
    }

}
