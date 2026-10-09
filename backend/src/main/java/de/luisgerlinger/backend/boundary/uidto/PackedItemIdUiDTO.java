package de.luisgerlinger.backend.boundary.uidto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class PackedItemIdUiDTO {
    private UUID activityId;
    private UUID itemId;
}
