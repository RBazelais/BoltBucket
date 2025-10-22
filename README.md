# WEB103 Project 4 - Bolt Bucket

Submitted by: Rachel Bazelais

About this web app: **BoltBucket is a custom car configurator that allows users to design and customize their dream cars. Users can select from various exterior colors, roof types, wheel styles, and interior options, see live price updates, and save their custom configurations to a gallery.**

Time spent: 12 hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [X] **The web app uses React to display data from the API.**
- [X] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table.**
	- [X]  **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
	- [X]  **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**
- [X] **Users can view **multiple** features of the `CustomItem` (e.g. car) they can customize, (e.g. wheels, exterior, etc.)**
- [X] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
- [X] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
- [X] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected *OR* The app displays the total price of all features.**
- [X] **The visual interface changes in response to at least one customizable feature.**
- [X] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
- [X] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
- [X] **Users can view a list of all submitted `CustomItem`s.**
- [X] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [X] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [X] **Users can update or delete `CustomItem`s that have been created from the detail page.**

The following **optional** features are implemented:

- [ ] Selecting particular options prevents incompatible options from being selected even before form submission

The following **additional** features are implemented:

- [X] **Reusable Picker Component**: Created a modular picker component used across Create, Edit, and Detail pages
- [X] **Horizontal Scrollable Option Grid**: Smooth horizontal scrolling interface for browsing customization options
- [X] **Auto-opening Picker from URL Hash**: Direct navigation to specific customization categories (e.g., `/edit#exterior`)
- [X] **Centralized Options Management**: Single source of truth for all available customization options
- [X] **Validation System**: Form validation with compatibility checks and payload validation

## Video Walkthrough

Here's a walkthrough of implemented required features:

![Video Walkthrough](client/src/assets/BoltBucketV2.gif "Video Walkthrough")

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ... LICEcap

## Technical Implementation

### Architecture

- **Frontend**: React with Vite for fast development and building
- **Backend**: Node.js with Express.js REST API
- **Database**: PostgreSQL with JSONB for flexible customization data storage
- **Routing**: React Router for client-side navigation
- **State Management**: React hooks for component state

### Key Features

- **Dynamic Pricing**: Real-time price calculation based on selected options
- **Image Management**: Asset pipeline with proper path resolution for development and production
- **Database Design**: Efficient storage of car configurations using JSONB for category_images
- **Component Architecture**: Reusable components with proper prop interfaces
- **Validation**: Both client-side and server-side validation for data integrity

### File Structure

```
client/
├── src/
│   ├── components/         # Reusable components (Picker)
│   ├── pages/              # Route components (CreateCar, EditCar, ViewCars, CarDetails)
│   ├── services/           # API service layer
│   ├── utilities/          # Helper functions (pricing, validation, options)
│   ├── css/                # Component-specific stylesheets
│   └── assets/images/      # Car customization images
server/
├── config/                 # Database configuration and seeding
├── controllers/            # API route handlers
└── server.js               # Express server setup
```

## Notes

**Challenges Encountered:**

- **Image Path Resolution**: Configuring proper asset paths for both development (Vite) and the API endpoints
- **Database Structure**: Designing efficient JSON storage for customization options while maintaining query performance
- **State Management**: Coordinating picker state between different components and maintaining consistency

**Key Solutions:**

- Created a centralized `getAllOptions()` utility to eliminate database dependency for option lists
- Implemented proper image asset pipeline by copying images to public directory
- Built reusable Picker component with flexible prop interface for different use cases
- Established clear separation between individual car data (selected options) and available options (all choices)

## License

Copyright 2025 Rachel Bazelais

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
