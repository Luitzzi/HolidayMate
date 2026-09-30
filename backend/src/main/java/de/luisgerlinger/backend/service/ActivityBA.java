package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.boundary.uidto.ActivityUiDTO;
import de.luisgerlinger.backend.entity.ActivityBE;
import de.luisgerlinger.backend.repository.ActivityRepository;
import de.luisgerlinger.backend.service.mapper.ActivityMapper;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityBA {

    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;

    public List<ActivityUiDTO> getAll() {
        List<ActivityBE> activities = activityRepository.findAllByOrderByNameAsc();
        return activityMapper.toDTOs(activities);
    }

    public Optional<ActivityUiDTO> getById(UUID id) {
        return activityRepository.findById(id)
                .map(activityMapper::toDTO);
    }

    public ActivityUiDTO create(ActivityUiDTO activity) {
        ActivityBE created = activityRepository.save(
                activityMapper.toBE(activity));
        return activityMapper.toDTO(created);
    }

    @Nullable
    public ActivityUiDTO update(UUID id, ActivityUiDTO activity) {
        if (!activityRepository.existsById(id))
            return null;
        ActivityBE updated = activityRepository.save(
                activityMapper.toBE(activity));
        return activityMapper.toDTO(updated);
    }
}
