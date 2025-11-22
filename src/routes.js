import { Router } from "express";
import { getDB } from "./db.js";
import { ObjectId } from "mongodb";

const router = Router();

// Return a few demo passengers for the UI dropdown
router.get("/passengers/demo", async (req, res, next) => {
  try {
    const db = getDB();
    const passengers = await db
      .collection("passengers")
      .find({})
      .project({ name: 1 }) // only return _id + name
      .limit(20)
      .toArray();

    res.json(passengers);
  } catch (err) {
    next(err);
  }
});


// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", ts: new Date().toISOString() });
});

// Flights search: /flights?origin=JFK&destination=LAX
router.get("/flights", async (req, res, next) => {
  try {
    const { origin, destination } = req.query;
    const db = getDB();
    const query = {};
    if (origin) query.origin = origin.toUpperCase();
    if (destination) query.destination = destination.toUpperCase();

    const flights = await db.collection("flights")
      .find(query)
      .sort({ departureTime: 1 })
      .limit(100)
      .toArray();
    res.json(flights);
  } catch (e) { next(e); }
});

// Create booking
router.post("/bookings", async (req, res, next) => {
  try {
    const { passengerId, flightId, seat, classType, price } = req.body;
    const db = getDB();

    const booking = {
      passengerId: new ObjectId(passengerId),
      flightId: new ObjectId(flightId),
      seat,
      ticketInfo: {
        class: classType,
        price,
        bookingDate: new Date()
      }
    };

    const result = await db.collection("bookings").insertOne(booking);
    res.status(201).json({ _id: result.insertedId, ...booking });
  } catch (e) { next(e); }
});

// Passenger bookings
router.get("/passengers/:id/bookings", async (req, res, next) => {
  try {
    const passengerId = new ObjectId(req.params.id);
    const db = getDB();

    const bookings = await db.collection("bookings").aggregate([
      { $match: { passengerId } },
      {
        $lookup: {
          from: "flights",
          localField: "flightId",
          foreignField: "_id",
          as: "flight"
        }
      },
      { $unwind: "$flight" },
      {
        $project: {
          seat: 1,
          ticketInfo: 1,
          flightNo: "$flight.flightNo",
          origin: "$flight.origin",
          destination: "$flight.destination",
          departureTime: "$flight.departureTime"
        }
      }
    ]).toArray();

    res.json(bookings);
  } catch (e) { next(e); }
});

// Analytics: safest/robust busiest routes
router.get("/analytics/busiest-routes", async (req, res, next) => {
  try {
    const db = getDB();
    const data = await db.collection("bookings").aggregate([
      { $match: { flightId: { $exists: true, $ne: null } } },
      {
        $lookup: {
          from: "flights",
          localField: "flightId",
          foreignField: "_id",
          as: "flight"
        }
      },
      { $unwind: { path: "$flight", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: { origin: "$flight.origin", destination: "$flight.destination" },
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 }
    ]).toArray();

    res.json(data);
  } catch (e) { next(e); }
});

export default router;
