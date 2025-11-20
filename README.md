
# Airline API

This is a small API I built with Node.js, Express, and MongoDB Atlas. It can search flights, show passenger bookings, create bookings, and return the busiest routes. It uses a small demo dataset. The API is deployed on Render.

**Health check:**
[https://airline-api-0yq5.onrender.com/api/health](https://airline-api-0yq5.onrender.com/api/health)

**Example endpoints:**

* **Flights search:**
  [https://airline-api-0yq5.onrender.com/api/flights?origin=JFK&destination=LAX](https://airline-api-0yq5.onrender.com/api/flights?origin=JFK&destination=LAX)
  This returns flights that match the origin and destination.

* **Busiest routes:**
  [https://airline-api-0yq5.onrender.com/api/analytics/busiest-routes](https://airline-api-0yq5.onrender.com/api/analytics/busiest-routes)
  Shows which routes have the most bookings.

* **Passenger bookings:**
  `/api/passengers/:id/bookings`
  Shows all bookings for a passenger.

* **Create booking (POST):**
  `/api/bookings`
  Adds a new booking to the system.

The API uses a simple index for flight searches and a basic MongoDB aggregation for the busiest routes. It’s mainly a practice project.

This API is used by a small React dashboard here:
[https://airline-dashboard-gamma.vercel.app/](https://airline-dashboard-gamma.vercel.app/)
