# Flightship

**Flightship** is a personalized long-distance travel assistant designed to help users track flights, check travel weather, and save meaningful journey notes. Built with React and Vite, the app combines real-time APIs and embedded maps to support relationships across distance.

![Flightship](/src/assets/images/flightship-app.png)

## 🎯 Project Objective

To create a web application that simplifies flight tracking and planning — especially for people in long-distance relationships. The app allows users to:

-   Search flights using essential details (e.g. flight date, route).
-   Save specific flights for future reference.
-   View weather risk indicators (rain, snow, wind) using dynamic icons on saved flights.
-   Leave personal messages attached to saved journeys.

## 🛠 Features

### 🔍 Flight Search

-   Search by **booking number**, **origin**, **destination**, and **flight date**.
-   Users manually input their API key for data privacy.
-   Flight data fetched using the [Google Flights API](https://rapidapi.com/DataCrawler/api/google-flights2).

### 💾 Save Flights

-   Save selected flights from search results.
-   Store flight details into **[Airtable](https://airtable.com/)** (with 3 linked tables: `Cities`, `Airports`, and `SavedFlights`).

### 🗺 Flight Details View

-   Embedded **[Leaflet Map](https://leafletjs.com/)** to show departure and arrival airports.
-   **Weather forecast icons** from [Tomorrow.io](https://www.tomorrow.io/) based on destination airport.
-   Add **personal messages** for each saved flight (e.g., “Counting down to see you ❤️”).

### 📁 Saved Flights Dashboard

-   View a list of all saved flights.
-   Click “View More” to expand details with map, weather icons, and message.

## 🧪 Technologies Used

-   **Frontend Framework**: React (with Vite)
-   **UI Library**: Chakra UI v3 (responsive components and styling)
-   **APIs**:
    -   [Google Flights API](https://rapidapi.com/DataCrawler/api/google-flights2) (flights)
    -   [Tomorrow.io](https://www.tomorrow.io/) (weather forecast)
    -   [Leaflet](https://leafletjs.com/) (maps)
-   **Database**: [Airtable](https://airtable.com/)
-   **Libraries**:
    -   React Router
    -   Leaflet.js
-   **Tools**:
    -   Postman (for API testing and response verification)
    -   Native `fetch` API for HTTP requests

## 🥪 How to Use Locally

```bash

# Clone the repository
git clone https://github.com/vinnyvaleria/flightship.git
cd flightship

# Install dependencies
npm install

# Set up your environment
# Create a .env file at the root of the project and add:
VITE_AIRTABLE_TOKEN = your_key_here
VITE_RAPID_TOKEN = your_key_here
VITE_TOMORROW_WEATHER_TOKEN = your_key_here

# Start the development server
npm run dev

```

Visit http://localhost:5173 to launch the app locally.

> Note: Flight search API may require manual entry of API key depending on usage model.

## 🚀 Future Enhancements

-   Integrate real-time flight tracking or delay notifications
-   User authentication and secure key management
-   Calendar sync for saved flights
-   Mobile responsiveness and PWA support
-   Love note sharing via email or SMS
-   Flight countdown widget

## 🙌 References and Credits

-   Flightship Logo: My sister [Ver](https://www.instagram.com/vervivre/)
-   Airports Dataset: [OpenFlights](https://nginx.openflights.org/data.php#airport)
-   Map Service: [Leaflet](https://leafletjs.com/)
-   Weather API: [Tomorrow.io](https://www.tomorrow.io/)
-   Hosted DB: [Airtable](https://airtable.com/)
-   UI Components: [Chakra UI v3](https://chakra-ui.com/)
-   Icons & Assets: [Font Awesome](https://fontawesome.com/), [Lucide](https://lucide.dev/)

Designed and developed by **Vinny Valeria**

## 📚 License

This project is for personal and educational use. All assets and source code are owned by the developer unless otherwise stated.

## 📝 Planning Process

-   Defined the app goal: helping long-distance couples manage travel more meaningfully
-   Researched APIs for flights, weather, maps, and location data
-   Designed the data structure for [Airtable](https://airtable.com/) with 3 related tables:
    -   `Airports`: stores airport info including coordinates and IATA code
    -   `Cities`: linked to airports
    -   `SavedFlights`: includes references to flight data and user messages
-   Mapped out the user journey: from searching flights → saving details → viewing enhanced info (map, weather, messages)

## 🧠 My Coding Approach

-   Built the app in layers based on API domains:
    1. First completed all flight-related functionality and API integration.
    2. Then added embedded maps using [Leaflet](https://leafletjs.com/) and airport coordinates.
    3. Followed by weather forecast integration from [Tomorrow.io](https://www.tomorrow.io/).
    4. Lastly, implemented the messaging feature tied to saved flights.
-   Used Postman extensively to test and debug external API responses.
-   Due to API rate limits, saved sample responses in local `data/flight.json` and `data/weather.json` for development and UI testing.
-   Debugged final implementation using real API keys and live network conditions.
-   Built reusable components (FlightCard, SearchForm, WeatherFlex) to organize logic clearly.
-   Managed state with `useState`, passed props for component communication, and lifted shared state where needed.

## 📚 What I Learnt

-   How to integrate and optimize multiple external APIs in a single user flow.
-   Structuring relational data in [Airtable](https://airtable.com/) and syncing it with a React frontend.
-   Styling efficiently with [Chakra UI's](https://chakra-ui.com/) component-based system.
-   Designing around real-world constraints like API rate limits.
-   Building an emotionally meaningful experience with both form and function.
-   Learned to manage technical scope and simplify logic under constraints.
-   Reflected on time management: balancing coding, debugging, and planning while juggling work commitments taught me the importance of early milestones and tighter iteration loops.
