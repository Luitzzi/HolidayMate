package de.luisgerlinger.backend.boundary.controller;

import de.luisgerlinger.backend.boundary.uidto.CategoryUiDTO;
import de.luisgerlinger.backend.service.CategoryBA;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Item categories used to group packing lists")
public class CategoryUiController {

    private final CategoryBA categoryBA;

    @GetMapping
    @Operation(summary = "Get all categories, ordered by name")
    public List<CategoryUiDTO> getAll() {
        return categoryBA.getAll();
    }

}
