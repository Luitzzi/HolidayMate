package de.luisgerlinger.backend.service;

import de.luisgerlinger.backend.boundary.uidto.ActivityUiDTO;
import de.luisgerlinger.backend.entity.ActivityBE;
import de.luisgerlinger.backend.entity.ItemBE;
import de.luisgerlinger.backend.entity.PackedItemBE;
import de.luisgerlinger.backend.repository.ActivityRepository;
import de.luisgerlinger.backend.service.mapper.ActivityMapper;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
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

    @Transactional
    public ActivityUiDTO create(ActivityUiDTO activity) {
        // Check if the activity has an id. If it has one an existing activity could be overwritten
        if (activity.getId() != null)
            throw new IllegalArgumentException("The activity to create must not contain an Id");

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
