package de.luisgerlinger.backend.boundary.uidto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "A category grouping items, e.g. Clothing or Gear")
public class CategoryUiDTO {
    private UUID id;

    @Schema(example = "Clothing")
    private String name;
}
