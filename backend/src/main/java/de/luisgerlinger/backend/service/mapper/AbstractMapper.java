package de.luisgerlinger.backend.service.mapper;

public interface AbstractMapper<BE, DTO> {

    DTO toDTO(BE entity);

    BE toBE(DTO dto);

}
