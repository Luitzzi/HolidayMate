package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.boundary.uidto.ActivityUiDTO;
import de.luisgerlinger.backend.boundary.uidto.CategoryUiDTO;
import de.luisgerlinger.backend.boundary.uidto.ItemUiDTO;
import de.luisgerlinger.backend.boundary.uidto.PackedItemUiDTO;
import de.luisgerlinger.backend.boundary.uidto.PackingConditionUiDTO;
import de.luisgerlinger.backend.entity.ActivityBE;
import de.luisgerlinger.backend.entity.CategoryBE;
import de.luisgerlinger.backend.entity.ItemBE;
import de.luisgerlinger.backend.entity.PackedItemBE;
import de.luisgerlinger.backend.entity.PackedItemId;
import de.luisgerlinger.backend.entity.PackingCondition;
import de.luisgerlinger.backend.repository.ActivityRepository;
import de.luisgerlinger.backend.repository.CategoryRepository;
import de.luisgerlinger.backend.repository.ItemRepository;
import de.luisgerlinger.backend.service.mapper.ActivityMapper;
import de.luisgerlinger.backend.service.mapper.ItemMapper;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that an ActivityUiDTO is mapped and persisted correctly, including
 * the creation of items and categories that do not exist yet.
 * The persistence context is cleared between steps to simulate separate requests.
 */
@SpringBootTest
@Transactional
class ActivityBATests {

    @Autowired
    private ActivityBA activityBA;
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ActivityMapper activityMapper;
    @Autowired
    private ItemMapper itemMapper;
    @Autowired
    private EntityManager entityManager;

    private CategoryBE clothing;
    private ItemBE socks;
    private ItemBE jacket;
    private ActivityBE hiking;

    @BeforeEach
    void setUp() {
        clothing = new CategoryBE();
        clothing.setName(unique("Clothing"));
        categoryRepository.save(clothing);

        socks = item("Socks", clothing);
        jacket = item("Jacket", clothing);

        hiking = new ActivityBE(null, unique("Hiking"));
        hiking.addPackedItem(new PackedItemBE(new PackedItemId(), 2, null, null, socks));
        activityRepository.save(hiking);

        flushAndClear();
    }

    @Test
    void updateExistingActivityWithExistingItemsAndCategories() {
        ActivityUiDTO dto = loadActivity(hiking.getId());
        dto.getPackedItems().getFirst().setAmount(3);
        dto.getPackedItems().add(packedItem(itemMapper.toDTO(jacket), 1));
        long activityCount = activityRepository.count();
        long itemCount = itemRepository.count();
        long categoryCount = categoryRepository.count();

        activityBA.update(hiking.getId(), dto);
        flushAndClear();

        ActivityBE saved = activityRepository
                .findById(hiking.getId())
                .orElseThrow();
        assertThat(amountsByItemName(saved))
                .containsExactlyInAnyOrderEntriesOf(Map.of(
                socks.getName(), 3,
                jacket.getName(), 1));
        assertThat(saved.getPackedItems())
                .extracting(packedItem -> packedItem.getOfItem().getId())
                .containsExactlyInAnyOrder(socks.getId(), jacket.getId());

        assertThat(activityRepository.count()).isEqualTo(activityCount);
        assertThat(itemRepository.count()).isEqualTo(itemCount);
        assertThat(categoryRepository.count()).isEqualTo(categoryCount);
    }

    @Test
    void updateExistingActivityWithNewItemInExistingCategory() {
        ActivityUiDTO dto = loadActivity(hiking.getId());
        ItemUiDTO hat = newItem("Hat", toDTO(clothing));
        dto.getPackedItems().add(packedItem(hat, 1));
        long activityCount = activityRepository.count();
        long itemCount = itemRepository.count();
        long categoryCount = categoryRepository.count();

        activityBA.update(hiking.getId(), dto);
        flushAndClear();

        ActivityBE saved = activityRepository.findById(hiking.getId()).orElseThrow();
        assertThat(amountsByItemName(saved)).containsExactlyInAnyOrderEntriesOf(Map.of(
                socks.getName(), 2,
                hat.getName(), 1));
        assertThat(findPackedItem(saved, hat.getName())
                .getOfItem().getCategory().getId())
                .isEqualTo(clothing.getId());

        assertThat(activityRepository.count()).isEqualTo(activityCount);
        assertThat(itemRepository.count()).isEqualTo(itemCount + 1);
        assertThat(categoryRepository.count()).isEqualTo(categoryCount);
    }

    @Test
    void updateExistingActivityWithMixedItemsAndCategories() {
        ActivityUiDTO dto = loadActivity(hiking.getId());

        ItemUiDTO hat = newItem("Hat", toDTO(clothing));
        // Two new items sharing the same new category must not create the category twice
        CategoryUiDTO campingGear = new CategoryUiDTO(null, unique("Camping gear"));
        ItemUiDTO tent = newItem("Tent", campingGear);
        ItemUiDTO sleepingBag = newItem("Sleeping bag", campingGear);

        dto.getPackedItems().add(packedItem(itemMapper.toDTO(jacket), 1));
        dto.getPackedItems().add(packedItem(hat, 1));
        dto.getPackedItems().add(packedItem(tent, 1));
        dto.getPackedItems().add(packedItem(sleepingBag, 2));

        long activityCount = activityRepository.count();
        long itemCount = itemRepository.count();
        long categoryCount = categoryRepository.count();

        activityBA.update(hiking.getId(), dto);
        flushAndClear();

        ActivityBE saved = activityRepository.findById(hiking.getId()).orElseThrow();
        assertThat(amountsByItemName(saved)).containsExactlyInAnyOrderEntriesOf(Map.of(
                socks.getName(), 2,
                jacket.getName(), 1,
                hat.getName(), 1,
                tent.getName(), 1,
                sleepingBag.getName(), 2));
        assertThat(findPackedItem(saved, tent.getName()).getOfItem().getCategory().getId())
                .isEqualTo(findPackedItem(saved, sleepingBag.getName()).getOfItem().getCategory().getId());

        assertThat(activityRepository.count()).isEqualTo(activityCount);
        assertThat(itemRepository.count()).isEqualTo(itemCount + 3);
        assertThat(categoryRepository.count()).isEqualTo(categoryCount + 1);
    }

    @Test
    void createNewActivityWithNewItemInNewCategory() {
        ItemUiDTO goggles = newItem("Ski goggles", new CategoryUiDTO(null, unique("Ski gear")));
        ActivityUiDTO dto = new ActivityUiDTO();
        dto.setName(unique("Skiing"));
        dto.getPackedItems().add(packedItem(goggles, 1));
        long itemCount = itemRepository.count();
        long categoryCount = categoryRepository.count();

        ActivityUiDTO created = activityBA.create(dto);
        flushAndClear();

        ActivityBE saved = activityRepository.findById(created.getId()).orElseThrow();
        assertThat(saved.getName()).isEqualTo(dto.getName());
        assertThat(amountsByItemName(saved)).containsExactlyInAnyOrderEntriesOf(Map.of(
                goggles.getName(), 1));
        assertThat(findPackedItem(saved, goggles.getName()).getOfItem().getCategory().getName())
                .isEqualTo(goggles.getCategory().getName());

        assertThat(itemRepository.count()).isEqualTo(itemCount + 1);
        assertThat(categoryRepository.count()).isEqualTo(categoryCount + 1);
    }

    /** Loads the activity like the frontend would receive it, detached from the persistence context. */
    private ActivityUiDTO loadActivity(UUID id) {
        ActivityUiDTO dto = activityBA.getById(id).orElseThrow();
        flushAndClear();
        return dto;
    }

    private ItemBE item(String name, CategoryBE category) {
        ItemBE item = new ItemBE();
        item.setName(unique(name));
        item.setCategory(category);
        return itemRepository.save(item);
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }

    private static Map<String, Integer> amountsByItemName(ActivityBE activity) {
        return activity.getPackedItems().stream()
                .collect(Collectors.toMap(
                        packedItem -> packedItem.getOfItem().getName(),
                        PackedItemBE::getAmount));
    }

    private static PackedItemBE findPackedItem(ActivityBE activity, String itemName) {
        return activity.getPackedItems().stream()
                .filter(packedItem -> packedItem.getOfItem().getName().equals(itemName))
                .findFirst()
                .orElseThrow();
    }

    private static CategoryUiDTO toDTO(CategoryBE category) {
        return new CategoryUiDTO(category.getId(), category.getName());
    }

    private static ItemUiDTO newItem(String name, CategoryUiDTO category) {
        ItemUiDTO item = new ItemUiDTO();
        item.setName(unique(name));
        item.setCategory(category);
        return item;
    }

    private static PackedItemUiDTO packedItem(ItemUiDTO item, int amount) {
        return new PackedItemUiDTO(null, amount, null, item);
    }

    /** Names are unique in the database, so test data must not collide with existing rows. */
    private static String unique(String name) {
        return name + " " + UUID.randomUUID();
    }
}
