package de.luisgerlinger.backend.service.mapper;

import de.luisgerlinger.backend.boundary.uidto.CategoryUiDTO;
import de.luisgerlinger.backend.entity.CategoryBE;
import org.mapstruct.Mapper;

@Mapper
public abstract class CategoryMapper implements AbstractMapper<CategoryBE, CategoryUiDTO> {

    @Override
    public abstract CategoryUiDTO toDTO(CategoryBE entity);

    @Override
    public abstract CategoryBE toBE(CategoryUiDTO categoryUiDTO);
}
