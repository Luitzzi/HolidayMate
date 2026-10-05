package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.boundary.uidto.CategoryUiDTO;
import de.luisgerlinger.backend.entity.CategoryBE;
import de.luisgerlinger.backend.repository.CategoryRepository;
import de.luisgerlinger.backend.service.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryBA {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryUiDTO> getAll() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(categoryMapper::toDTO)
                .toList();
    }

    public CategoryUiDTO create(CategoryUiDTO category) {
        CategoryBE created = categoryRepository.save(
                categoryMapper.toBE(category));
        return categoryMapper.toDTO(created);
    }
}
