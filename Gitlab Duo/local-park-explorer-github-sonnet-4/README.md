# Local Park Explorer

Local Park Explorer is a React application designed to help users discover public parks in Atlanta, GA. The application utilizes data from the Fulton County GIS Portal to provide an interactive map and various features for searching and filtering parks.

## Features

- Interactive map displaying parks in Atlanta using Leaflet.js
- Search functionality to find parks by name
- Filter options to narrow down parks based on amenities
- Mobile-friendly design for easy access on various devices

## Project Structure

```
local-park-explorer
├── public
│   └── parks.json          # Static dataset of parks
├── src
│   ├── components          # React components for the application
│   │   ├── Map.tsx        # Map component using Leaflet.js
│   │   ├── ParkList.tsx    # Component to display a list of parks
│   │   ├── SearchBar.tsx    # Search bar for park name
│   │   └── Filter.tsx       # Filter component for amenities
│   ├── hooks               # Custom hooks for data fetching and state management
│   │   └── useParks.ts     # Hook to fetch and manage park data
│   ├── types               # TypeScript types for the application
│   │   └── park.ts         # Type definition for park objects
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point of the application
│   └── index.css           # Global styles
├── .gitlab-ci.yml          # CI/CD configuration for GitLab
├── index.html              # Main HTML template
├── package.json            # npm configuration file
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Project documentation
```

## Getting Started

To get started with the Local Park Explorer application, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd local-park-explorer
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the application:
   ```
   npm run dev
   ```

5. Open your browser and go to `http://localhost:3000` to view the application.

## Deployment

This application can be deployed using GitLab Pages. Ensure that the `.gitlab-ci.yml` file is configured correctly to handle the build and deployment process.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.