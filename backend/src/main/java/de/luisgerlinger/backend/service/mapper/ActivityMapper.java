package de.luisgerlinger.backend.service.mapper;

import de.luisgerlinger.backend.boundary.uidto.ActivityUiDTO;
import de.luisgerlinger.backend.entity.ActivityBE;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper
public abstract class ActivityMapper implements AbstractMapper<ActivityBE, ActivityUiDTO> {

    @Override
    public abstract ActivityUiDTO toDTO(ActivityBE entity);

    @Override
    public abstract ActivityBE toBE(ActivityUiDTO activityUiDTO);

    public abstract List<ActivityUiDTO> toDTOs(List<ActivityBE> entities);

}
