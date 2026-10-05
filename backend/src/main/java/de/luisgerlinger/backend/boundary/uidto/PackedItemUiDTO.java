package de.luisgerlinger.backend.boundary.uidto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class PackedItemUiDTO {

    @Nullable
    private UUID id;

    @Positive
    private int amount;

    @Nullable
    private PackingConditionUiDTO packingCondition;

    private ItemUiDTO ofItem;
}
