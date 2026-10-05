package de.luisgerlinger.backend.boundary.uidto;

import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryUiDTO {

    @Nullable
    private UUID id;

    private String name;
}
