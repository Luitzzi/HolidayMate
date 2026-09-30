package de.luisgerlinger.backend.boundary.uidto;

import jakarta.annotation.Nullable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ActivityUiDTO {

    @Nullable
    private UUID id;

    private String name;

    private List<PackedItemUiDTO> packedItems = new ArrayList<>();

}
