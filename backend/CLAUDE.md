# Backend

Java Spring Boot + Hibernate application.
Additionally:
- Lombok
- Typescript generator plugin

## Conventions
I use the Boundary-Service/Control-Entity Pattern.
Everything handling outgoing/incoming data belongs to the boundary layer.
From there it goes over service classes (xBA) where it is processed and
if necessary the entity (xBE) is saved to the database via a repository file (xRepository).
If data is retrieved it follows the same way in the opposite direction.
Data containers that can be retrieved from the frontend are called UiDTOs.
Normal data containers just DTO.

Do not use @Data with Lombok, use the specific annotations