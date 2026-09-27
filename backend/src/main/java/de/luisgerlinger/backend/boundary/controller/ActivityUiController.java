package de.luisgerlinger.backend.boundary.controller;

import de.luisgerlinger.backend.boundary.uidto.ActivityUiDTO;
import de.luisgerlinger.backend.service.ActivityBA;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
@Tag(name = "Activities", description = "Define activities and their packing lists")
public class ActivityUiController {

    private final ActivityBA activityBA;

    @GetMapping
    @Operation(summary = "Get all activities, ordered by name")
    public List<ActivityUiDTO> getAll() {
        return activityBA.getAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an activity by id")
    @ApiResponse(responseCode = "200", description = "Activity found")
    @ApiResponse(responseCode = "404", description = "Activity not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ActivityUiDTO get(@PathVariable UUID id) {
        return activityBA.get(id);
    }

    @PostMapping
    @Operation(summary = "Create an activity",
            description = "Items and categories are referenced by name and created if they do not exist yet.")
    @ApiResponse(responseCode = "201", description = "Activity created")
    @ApiResponse(responseCode = "400", description = "Invalid request body",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ResponseEntity<ActivityUiDTO> create(@Valid @RequestBody ActivityUiDTO activityUiDTO) {
        ActivityUiDTO created = activityBA.create(activityUiDTO);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an activity",
            description = "Replaces name and packing list. Packed items are matched by id, "
                    + "items without id are added and items not in the list are removed.")
    @ApiResponse(responseCode = "200", description = "Activity updated")
    @ApiResponse(responseCode = "400", description = "Invalid request body",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    @ApiResponse(responseCode = "404", description = "Activity not found",
            content = @Content(schema = @Schema(implementation = ProblemDetail.class)))
    public ActivityUiDTO update(@PathVariable UUID id, @Valid @RequestBody ActivityUiDTO activityUiDTO) {
        return activityBA.update(id, activityUiDTO);
    }

}
