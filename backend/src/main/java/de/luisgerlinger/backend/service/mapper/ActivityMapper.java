package de.luisgerlinger.backend.service.mapper;

import de.luisgerlinger.backend.boundary.uidto.ActivityUiDTO;
import de.luisgerlinger.backend.entity.ActivityBE;
import de.luisgerlinger.backend.entity.PackedItemBE;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper
public abstract class ActivityMapper implements AbstractMapper<ActivityBE, ActivityUiDTO> {

    @Autowired
    private PackedItemMapper packedItemMapper;

    @Override
    public abstract ActivityUiDTO toDTO(ActivityBE entity);

    @Override
    public ActivityBE toBE(ActivityUiDTO activityUiDTO) {
        UUID maybeActivityId = activityUiDTO.getId();
        ActivityBE activityBE = new ActivityBE(
            maybeActivityId,
            activityUiDTO.getName()
        );
        activityUiDTO.getPackedItems()
                .forEach(packedItemUiDTO -> {
                    PackedItemBE packedItemBE = packedItemMapper
                            .toBE(packedItemUiDTO, maybeActivityId);
                    activityBE.addPackedItem(packedItemBE);
                });
        return activityBE;
    }

    public abstract List<ActivityUiDTO> toDTOs(List<ActivityBE> entities);

}
