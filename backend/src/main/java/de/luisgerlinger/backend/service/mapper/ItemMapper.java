package de.luisgerlinger.backend.service.mapper;

import de.luisgerlinger.backend.boundary.uidto.ItemUiDTO;
import de.luisgerlinger.backend.entity.ItemBE;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;

@Mapper(uses = CategoryMapper.class)
@RequiredArgsConstructor
public abstract class ItemMapper implements AbstractMapper<ItemBE, ItemUiDTO> {

    @Override
    public abstract ItemUiDTO toDTO(ItemBE entity);

    @Override
    public abstract ItemBE toBE(ItemUiDTO itemUiDTO);
}
