package de.luisgerlinger.backend.boundary.uidto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Schema(description = "An item on the packing list of an activity")
public class PackedItemUiDTO {

    @Schema(description = "Null for new entries, set to update an existing entry")
    @Nullable
    private UUID id;

    @NotBlank
    @Schema(description = "Item name, reused if an item with this name exists in the category", example = "Extra socks")
    private String name;

    @NotBlank
    @Schema(description = "Category name, created if it does not exist yet", example = "Clothing")
    private String category;

    @Positive
    @Schema(example = "3")
    private int amount;
}
