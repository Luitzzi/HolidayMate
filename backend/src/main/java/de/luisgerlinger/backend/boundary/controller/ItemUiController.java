package de.luisgerlinger.backend.boundary.controller;

import de.luisgerlinger.backend.boundary.uidto.CategoryUiDTO;
import de.luisgerlinger.backend.boundary.uidto.ItemUiDTO;
import de.luisgerlinger.backend.service.ItemBA;
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
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Item categories used to group packing lists")
public class ItemUiController {

    private final ItemBA itemBA;

    @GetMapping
    @Operation(summary = "Get all items, ordered by name")
    public List<ItemUiDTO> getAll() {
        return itemBA.getAll();
    }

    @PostMapping
    @Operation(summary = "Create an item")
    @ApiResponse(responseCode = "201", description = "Create successful")
    @ApiResponse(responseCode = "400", description = "Invalid request body")
    public ResponseEntity<ItemUiDTO> create(@RequestBody ItemUiDTO itemUiDTO) {
        ItemUiDTO created = itemBA.create(itemUiDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }
}
