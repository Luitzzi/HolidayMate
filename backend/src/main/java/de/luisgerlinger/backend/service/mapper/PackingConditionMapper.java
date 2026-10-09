package de.luisgerlinger.backend.service.mapper;

import de.luisgerlinger.backend.boundary.uidto.PackingConditionUiDTO;
import de.luisgerlinger.backend.entity.PackingCondition;
import org.mapstruct.Mapper;

@Mapper
public abstract class PackingConditionMapper implements AbstractMapper<PackingCondition, PackingConditionUiDTO> {

    @Override
    public abstract PackingConditionUiDTO toDTO(PackingCondition entity);

    @Override
    public abstract PackingCondition toBE(PackingConditionUiDTO packingConditionUiDTO);
}
