package de.luisgerlinger.backend.service.mapper;

import de.luisgerlinger.backend.boundary.uidto.ItemUiDTO;
import de.luisgerlinger.backend.boundary.uidto.PackedItemIdUiDTO;
import de.luisgerlinger.backend.boundary.uidto.PackedItemUiDTO;
import de.luisgerlinger.backend.boundary.uidto.PackingConditionUiDTO;
import de.luisgerlinger.backend.entity.PackedItemBE;
import de.luisgerlinger.backend.entity.PackedItemId;
import jakarta.annotation.Nullable;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

@Mapper
public abstract class PackedItemMapper {

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private PackingConditionMapper packingConditionMapper;

    public PackedItemUiDTO toDTO(PackedItemBE entity) {
        UUID activityId = entity.getId().getActivityId();
        UUID itemId = entity.getId().getActivityId();
        return new PackedItemUiDTO(
                new PackedItemIdUiDTO(activityId, itemId),
                entity.getAmount(),
                packingConditionMapper.toDTO(entity.getPackingCondition()),
                itemMapper.toDTO(entity.getOfItem())
        );
    }

    public PackedItemBE toBE(
            PackedItemUiDTO packedItemUiDTO,
            @Nullable UUID activityId
    ) {
        ItemUiDTO itemUiDTO = packedItemUiDTO.getOfItem();
        PackingConditionUiDTO packingConditionUiDTO = packedItemUiDTO.getPackingCondition();
        return new PackedItemBE(
                new PackedItemId(activityId, itemUiDTO.getId()),
                packedItemUiDTO.getAmount(),
                packingConditionMapper.toBE(packingConditionUiDTO),
                null,
                itemMapper.toBE(itemUiDTO)
        );
    }

}
