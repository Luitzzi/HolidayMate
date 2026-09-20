# HolidayMate

A web application for building reusable packing lists per holiday type.
Learn from your mistakes and come prepared in your next holiday.
Pack what you actually need instead of finding out on location!

## Overview

Most people only learn what they should have packed while already on holiday. 
HolidayMate captures that experience: 
Define a packing list once for a holiday type (e.g. kayaking, beach)
and reuse it for every future trip of that type.

**Examples**

| Holiday type | Items worth remembering                                  |
| ------------ | -------------------------------------------------------- |
| Kayaking     | Extra set of clothes, bike gloves (prevent blisters)     |
| Beach        | Games and other items you specifically want to bring     |

## Use Case

The application has two menus.

### 1. Definition Menu

Manage activity types and their packing lists.

- Create / Edit / Delete an activity.

### 2. Planning Menu

Plan a concrete holiday based on a holiday type.

- Select a holiday type
- Generate the packing list for the trip

**Planned (vision)**

- Enter travel date, location and holiday type
- Fetch the weather forecast for the location if the trip starts within 7 days
- Calculate the packing list from the forecast using configurable clothing rules
    - Example rule: *daytime temperature < 15 °C → pack a jacket*
- Define rules in an activity that only should activate if a condition is met.
  Expl. extra pair of cloting if weather could be bad

## Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| Frontend | TypeScript, React, Ant Design, ESLint, Prettier        |
| Backend  | Java, Spring, Hibernate / Postgres                     |
| Weather Provider:| OpenWeatherMap                                 |

