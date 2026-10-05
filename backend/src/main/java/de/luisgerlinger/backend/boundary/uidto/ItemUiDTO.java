package de.luisgerlinger.backend.boundary.uidto;

import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ItemUiDTO {

    @Nullable
    private UUID id;

    private String name;

    private CategoryUiDTO categoryUiDTO;

    private PackingConditionUiDTO itemCondition;

}
