package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.boundary.uidto.ActivityUiDTO;
import de.luisgerlinger.backend.entity.*;
import de.luisgerlinger.backend.repository.ActivityRepository;
import de.luisgerlinger.backend.service.mapper.ActivityMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityBA {

    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;
    private final CategoryBA categoryBA;
    private final ItemBA itemBA;

    public List<ActivityUiDTO> getAll() {
        List<ActivityBE> activities = activityRepository.findAllByOrderByNameAsc();
        return activityMapper.toDTOs(activities);
    }

    public Optional<ActivityUiDTO> getById(UUID id) {
        return activityRepository.findById(id)
                .map(activityMapper::toDTO);
    }

    @Transactional
    public ActivityUiDTO create(
            ActivityUiDTO activity
    ) throws IllegalArgumentException {
        ActivityBE activityBE = activityMapper.toBE(activity);
        createNonExistingCategoriesAndItems(activityBE);
        ActivityBE created = activityRepository.persist(activityBE);
        return activityMapper.toDTO(created);
    }

    @Transactional
    public ActivityUiDTO update(UUID id, ActivityUiDTO activity) {
        validateUpdateRequest(id, activity);

        ActivityBE activityBE = activityMapper.toBE(activity);
        createNonExistingCategoriesAndItems(activityBE);
        ActivityBE updated = activityRepository.save(activityBE);
        return activityMapper.toDTO(updated);
    }

    private void validateUpdateRequest(UUID id, ActivityUiDTO activity) {
        if (id == null || activity.getId() == null) {
            log.warn("Tried to update an activity with no id. Id: {}, Activity: {}",
                    id, activity);
            throw new IllegalArgumentException("Update activity with null id is not allowed");
        }
        if (!activity.getId().equals(id)) {
            log.warn("Tried to update an activity with another id. Id: {}, Activity: {}",
                    id, activity);
            throw new IllegalArgumentException("Provided id deviates from the category id");
        }
        if (!activityRepository.existsById(id)) {
            log.warn("Tried to update an non-existing activity. Id: {}, Activity: {}",
                    id, activity);
            throw new IllegalArgumentException("Activity does not exist");
        }
    }

    private void createNonExistingCategoriesAndItems(ActivityBE activityBE) {
        final List<ItemBE> items = activityBE.getPackedItems().stream()
                .map(PackedItemBE::getOfItem)
                .toList();

        final Map<String, CategoryBE> newCategoriesByNormalizedName =
                unifyNewCategories(items);

        Map<String, ItemBE> newItemsByNormalizedName;
        try {
            newItemsByNormalizedName = getNewItemsByNormalizedName(items);
        } catch (IllegalArgumentException e) {
            log.warn(
                    """
                        Activity contained duplicate normalizedName items was tried to be created.
                        Activity: {}"
                    """, activityBE);
            throw e;
        }

        categoryBA.createAll(newCategoriesByNormalizedName.values());
        itemBA.createAll(newItemsByNormalizedName.values());
    }

    private Map<String, ItemBE> getNewItemsByNormalizedName(
            Collection<ItemBE> items
    ) throws IllegalArgumentException {
        try {
            return items.stream()
                    .filter(item -> item.getId() == null)
                    .collect(Collectors.toUnmodifiableMap(
                            ItemBE::getNormalizedName,
                            Function.identity()
                    ));
        } catch (IllegalStateException e) {
            throw new IllegalArgumentException("No duplicate normalizedNames for items allowed");
        }
    }

    /**
     * Unify all duplicated occurrences of a category.
     * If multiple items have the same newly created category, the first one wins
     * and all other items reference this category.
     * For the category it is checked if its normalized name already exists.
     * If so the already existing one wins.
     * @param items All created items, even existing ones
     * @return Map of all newly created categories by their normalizedName
     */
    private Map<String, CategoryBE> unifyNewCategories(Collection<ItemBE> items) {
        final Map<String, CategoryBE> newCategoriesByNormalizedName = new HashMap<>();
        for (ItemBE item : items) {
            CategoryBE categoryBE = item.getCategory();
            if (categoryBE.getId() != null)
                continue;
            // The first occurrence of a normalized name wins, all later items reference it
            CategoryBE unifiedCategory = newCategoriesByNormalizedName.computeIfAbsent(
                    categoryBE.getNormalizedName(),
                    normalizedName ->
                        // The existing category wins
                        checkIfCategoryAlreadyExists(normalizedName)
                                .orElse(categoryBE)
                    );
            item.setCategory(unifiedCategory);
        }
        return newCategoriesByNormalizedName;
    }

    private Optional<CategoryBE> checkIfCategoryAlreadyExists(String name) {
        return categoryBA.findByNormalizedName(name);
    }
}
