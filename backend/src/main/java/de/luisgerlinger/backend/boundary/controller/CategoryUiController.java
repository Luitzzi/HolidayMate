package de.luisgerlinger.backend.boundary.controller;

import de.luisgerlinger.backend.boundary.uidto.ActivityUiDTO;
import de.luisgerlinger.backend.boundary.uidto.CategoryUiDTO;
import de.luisgerlinger.backend.service.CategoryBA;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
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

    @PostMapping
    @Operation(summary = "Create a category")
    @ApiResponse(responseCode = "201", description = "Create successful")
    @ApiResponse(responseCode = "400", description = "Invalid request body")
    public ResponseEntity<CategoryUiDTO> create(@RequestBody CategoryUiDTO category) {
        CategoryUiDTO created = categoryBA.create(category);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }
}
