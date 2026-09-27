package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.boundary.uidto.CategoryUiDTO;
import de.luisgerlinger.backend.entity.CategoryBE;
import de.luisgerlinger.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryBA {

    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<CategoryUiDTO> getAll() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(category -> new CategoryUiDTO(category.getId(), category.getName()))
                .toList();
    }

    CategoryBE findOrCreate(String name) {
        String trimmed = name.trim();
        return categoryRepository.findByNameIgnoreCase(trimmed)
                .orElseGet(() -> {
                    CategoryBE category = new CategoryBE();
                    category.setName(trimmed);
                    return categoryRepository.save(category);
                });
    }

}
