## Prompt

You're building a React 19 web app called Local Park Explorer, designed to help people discover public parks in Atlanta, GA using data from the Fulton County GIS Portal.
The goal is to create a mobile-friendly, interactive map with search and filtering features that highlight nearby green spaces.

The dataset structure should look like this:
```json
[
 {
  "name": "Grant Park",
  "latitude": 33.7366,
  "longitude": -84.3733,
  "amenities": ["dog park", "playground", "walking trail"]
 },
 {
  "name": "Piedmont Park",
  "latitude": 33.7851,
  "longitude": -84.3738,
  "amenities": ["tennis courts", "picnic area", "soccer field"]
 }
]
```

The app should:

- Be created using React 19 + Vite
- Render a map using Leaflet.js and place pins from a static dataset (parks.json)
- Include search and filter functionality for park name and amenities
- Be deployable via GitLab Pages
- Scaffold the project, implement features, and configure deployment
