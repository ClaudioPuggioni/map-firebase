# Trip planner Challenge

A collabarative trip planner website which uses Firebase as the Backend.

## Create a react app with following features

- Email Login and Signup with Firebase
- Profile Page
  - It shows the details of the current user profile
  - Should show the places where you have been to
  
- Plan a trip page
  - It should ask for details like Trips Title, Description, Status (Planning, Completed or Cancelled)
  - There should be a date range picker where you select the trip dates (start date and end date)
  - It should have a search box which search results for the places you search
    - Show the list of places from the Mapbox API, such that user can select them
    - Show a button `Add places` to the trip, this will add all the selected places to the trip you are planning for
  - Add users to the trip
  
- Trip Detail Page
  - Allows you to modify status, title and description
  - You can add/remove places
  
- Trips Page
  - ``Upcoming Trips``
    - Shows all the trips that are not yet started
  - ``Completed Trips``
    - Show all the trips that are completed
  - ``Cancelled Trips``
    - Show all the trips that were cancelled
  - On Click on each trip instance
    - It should show the details of the trip
      - Places
      - Date Range when it’s planned for
      - Status

### API for Places

- [API](https://docs.mapbox.com/api/search/geocoding/)
- [GENERATE TOKEN INSTRUCTIONS](https://docs.mapbox.com/help/glossary/access-token/)

### You can come up with your Own UI/UX, Show us how creative you are. You can try using Tailwind CSS for this project.

### Hints

- You can manage the registered user in the database when they register in your platform
  - Maintain a unique identifier like email or Id


# Stretch
Invite other users to be part of a trip!
