# UNICON19

## Overview
UNICON19 is a comprehensive visualization project showcasing various aspects of the Unicycling World Championships. The project includes interactive maps, charts, and other visualizations to help users explore and understand the event's global participation, event durations, and venue locations.

## Visualizations
### 1. Global Participation Map
- **File:** `choro.html`
- **Description:** This interactive choropleth map displays worldwide participation and winners from UNICON19. Users can hover over countries to see the number of participants and winners.
- **Motive:** To highlight the global reach and participation in the Unicycling World Championships.

### 2. Event Duration Pie Chart
- **File:** `pie.html`
- **Description:** This interactive pie chart with inner bar charts displays the durations of various events. Users can hover over different sections to see detailed insights into competition timelines.
- **Motive:** To provide a detailed breakdown of the time spent on different events during the championships.

### 3. Venues & Routes Map
- **File:** `map.html`
- **Description:** This comprehensive map shows all venues, lodging options, and travel routes. Users can toggle different layers to view venues, transport options, and lodging locations.
- **Motive:** To help participants and visitors plan their UNICON19 experience by providing a detailed travel guide.

## Running the Project
### Prerequisites
- A web browser (preferably Chrome or Firefox)
- Internet connection to load external libraries (D3.js, Leaflet.js)
- Python installed on your machine

### Steps to Run
1. **Clone the Repository:**
   ```sh
   git clone https://github.com/hrishirajmitra/UNICON19.git
   cd UNICON19
   ```

2. **Start the Python Server:**
   ```sh
   cd pages
   python -m http.server 8000
   ```

3. **Open the Project:**
   - Open your web browser and navigate to `http://localhost:8000`.

4. **Explore the Visualizations:**
   - From the home page (`index.html`), you can navigate to different visualizations:
     - **Global Participation Map:** Click on "View Map" under the "Global Participation" section.
     - **Event Duration Pie Chart:** Click on "View Chart" under the "Event Duration" section.
     - **Venues & Routes Map:** Click on "View Locations" under the "Venues & Routes" section.

## Additional Information
- **Data Sources:** The data used in these visualizations are sourced from CSV files and GeoJSON files.
- **Libraries Used:**
  - [D3.js](https://d3js.org/) for data visualization.
  - [Leaflet.js](https://leafletjs.com/) for interactive maps.
  - [arc.js](https://github.com/springmeyer/arc.js) for geodesic routes.

