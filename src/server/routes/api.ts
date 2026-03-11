import { Router } from 'express';
import mongoose from 'mongoose';
import { mockRoutes, mockStops, mockTimings, mockLiveBuses, mockAnnouncements, mockFeedback } from '../data/mockData.js';
import { Feedback, SOSAlert } from '../models/index.js';

import { GoogleGenAI } from '@google/genai';

const router = Router();

// SOS API
router.post('/sos', async (req, res) => {
  try {
    const { user_id, bus_number, latitude, longitude } = req.body;
    const alert = new SOSAlert({ user_id, bus_number, latitude, longitude });
    await alert.save();
    res.json({ success: true, message: 'SOS alert sent' });
  } catch (error) {
    console.error('SOS error:', error);
    res.status(500).json({ error: 'Failed to send SOS' });
  }
});

router.get('/seats/:busRouteId', async (req, res) => {
  const { busRouteId } = req.params;
  const { date } = req.query;

  try {
    const seats = await Seat.find({ bus_route_id: busRouteId, travel_date: date });
    
    // Recommendation Logic
    const recommendedSeats = seats.map(seat => {
      let score = 0;
      if (seat.is_window) score += 5;
      score += seat.proximity_score; // Higher is better (less crowded)
      // Mock User Preference Score (could be fetched from user profile)
      score += Math.random() * 3; 

      return { ...seat.toObject(), score };
    }).sort((a, b) => b.score - a.score);

    const topSeats = recommendedSeats.slice(0, 3).map(s => s.seat_number);
    
    res.json(seats.map(s => ({
      ...s.toObject(),
      isRecommended: topSeats.includes(s.seat_number)
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seats' });
  }
});

// Passenger APIs
router.get('/user/analytics/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await Booking.find({ userId });
    
    const totalTrips = bookings.length;
    const totalDistance = bookings.reduce((sum, b) => sum + (b.distance_km || 0), 0);
    const totalMoneySpent = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    
    const routeCounts: Record<string, number> = {};
    bookings.forEach(b => {
      const route = `${b.source} → ${b.destination}`;
      routeCounts[route] = (routeCounts[route] || 0) + 1;
    });
    
    let favoriteRoute = 'None';
    let maxCount = 0;
    for (const route in routeCounts) {
      if (routeCounts[route] > maxCount) {
        maxCount = routeCounts[route];
        favoriteRoute = route;
      }
    }

    const recentTrips = bookings.sort((a, b) => b.travelDate.getTime() - a.travelDate.getTime()).slice(0, 5);

    res.json({
      totalTrips,
      totalDistance,
      totalMoneySpent,
      favoriteRoute,
      recentTrips
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key is missing' });
    }
    const ai = new GoogleGenAI({ apiKey });
    
    // Provide some context about the bus system to the AI
    const systemInstruction = `You are a helpful AI assistant for a smart bus timing web app in Tamil Nadu. 
    Here is some context about the available routes: ${JSON.stringify(mockRoutes.map(r => ({bus: r.bus_number, from: r.source, to: r.destination, stops: r.stops}))) }.
    Answer the user's questions concisely and politely.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: message,
      config: {
        systemInstruction,
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

import { Booking, BusRoute, User } from '../models/index.js';
import { routeEngine, formatDuration } from '../services/routeEngine';
import { AnalyticsEngine } from '../services/AnalyticsEngine';
import { trackingService } from '../services/trackingService';

router.get('/tracking/buses', (req, res) => {
  const buses = trackingService.getActiveBuses();
  res.json({ buses });
});

router.get('/analytics', async (req, res) => {
  try {
    const analytics = await AnalyticsEngine.generateAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

router.post('/book', async (req, res) => {
  try {
    const { busRouteId, travelDate, seats, totalPrice, userId } = req.body;
    
    if (!busRouteId || !travelDate || !seats || !seats.length || !totalPrice) {
      return res.status(400).json({ error: 'Missing required booking details' });
    }

    // In a real app, we'd verify the user from a token
    // For now, we'll create a dummy user if none provided, or use the provided one
    let actualUserId = userId;
    if (!actualUserId && mongoose.connection.readyState === 1) {
      let user = await User.findOne({ email: 'guest@example.com' });
      if (!user) {
        user = await User.create({ name: 'Guest User', email: 'guest@example.com' });
      }
      actualUserId = user._id;
    }

    if (mongoose.connection.readyState === 1) {
      // Update available seats
      const bus = await BusRoute.findById(busRouteId);
      if (!bus) {
        return res.status(404).json({ error: 'Bus route not found' });
      }

      if (bus.available_seats < seats.length) {
        return res.status(400).json({ error: 'Not enough seats available' });
      }

      bus.available_seats -= seats.length;
      await bus.save();

      const booking = new Booking({
        userId: actualUserId,
        busRouteId,
        travelDate: new Date(travelDate),
        seats,
        totalPrice,
        status: 'Confirmed',
        qrCodeData: `TNSTC-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      });

      await booking.save();
      
      // Re-load route engine cache to reflect new seat counts
      await routeEngine.loadDataset();

      return res.json({ success: true, booking });
    } else {
      // Fallback for no DB
      return res.json({ 
        success: true, 
        booking: { 
          _id: `B${Date.now()}`,
          seats,
          totalPrice,
          status: 'Confirmed',
          qrCodeData: `TNSTC-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        } 
      });
    }
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to process booking' });
  }
});

router.get(['/buses', '/search-buses'], async (req, res) => {
  const { from, to } = req.query;
  
  console.log(`[API Search] From: ${from}, To: ${to}`);

  if (from && to && (from as string).toLowerCase() === (to as string).toLowerCase()) {
    return res.status(400).json({ error: 'Source and destination cannot be the same district.' });
  }

  const source = (from as string) || 'Chennai';
  const destination = (to as string) || 'Madurai';

  const routeOptions = await routeEngine.findRoutes(source, destination);
  
  console.log(`[API Search] Found ${routeOptions.length} route options`);

  const statuses = ['On Time', 'Delayed', 'On Time', 'On Time'];

  const results = routeOptions.map((option, index) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    if (option.type === 'direct') {
      const bus = option.buses[0];
      return {
        id: bus._id || `bus_${index}_${Date.now()}`,
        bus_no: bus.bus_number,
        type: bus.bus_type,
        departure: bus.departure_time,
        arrival: bus.arrival_time,
        duration: formatDuration(option.total_duration_mins),
        price: option.total_price,
        seats: bus.available_seats,
        status: status,
        source: bus.source,
        destination: bus.destination,
        isConnecting: false,
        connections: []
      };
    } else {
      const bus1 = option.buses[0];
      const bus2 = option.buses[1];
      return {
        id: `bus_${index}_${Date.now()}`,
        bus_no: 'Connecting Route',
        type: 'Multiple',
        departure: bus1.departure_time,
        arrival: bus2.arrival_time,
        duration: formatDuration(option.total_duration_mins),
        price: option.total_price,
        seats: Math.min(bus1.available_seats, bus2.available_seats),
        status: status,
        source: bus1.source,
        destination: bus2.destination,
        isConnecting: true,
        connections: [
          {
            id: bus1._id,
            from: bus1.source,
            to: bus1.destination,
            bus_no: bus1.bus_number,
            type: bus1.bus_type,
            departure: bus1.departure_time,
            arrival: bus1.arrival_time
          },
          {
            id: bus2._id,
            from: bus2.source,
            to: bus2.destination,
            bus_no: bus2.bus_number,
            type: bus2.bus_type,
            departure: bus2.departure_time,
            arrival: bus2.arrival_time
          }
        ]
      };
    }
  });

  res.json({
    message: results.length > 0 ? "Showing best available buses and nearby routes" : "No direct routes found. Please try another destination.",
    buses: results
  });
});

router.get('/routes', (req, res) => {
  res.json(mockRoutes);
});

router.get('/stops/:route_id', (req, res) => {
  const routeId = req.params.route_id;
  const stops = mockStops.filter(s => s.route_id === routeId);
  res.json(stops);
});

router.get('/timings/:route_id', (req, res) => {
  const routeId = req.params.route_id;
  const timings = mockTimings.filter(t => t.route_id === routeId);
  res.json(timings);
});

router.get('/live-buses', (req, res) => {
  res.json(mockLiveBuses);
});

router.get('/announcements', (req, res) => {
  res.json(mockAnnouncements);
});

router.post('/feedback', async (req, res) => {
  const { category, description, busNumber, route } = req.body;
  
  try {
    if (mongoose.connection.readyState === 1) {
      // Connected to MongoDB
      const newFeedback = new Feedback({
        category,
        description,
        busNumber,
        route,
        status: 'Pending'
      });
      await newFeedback.save();
      return res.json({ success: true, message: 'Feedback submitted successfully', feedback: newFeedback });
    } else {
      // Fallback to mock data
      const newFeedback = {
        _id: `F${Date.now()}`,
        category,
        description,
        busNumber,
        route,
        status: 'Pending',
        created_at: new Date().toISOString()
      };
      mockFeedback.unshift(newFeedback);
      return res.json({ success: true, message: 'Feedback submitted successfully', feedback: newFeedback });
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Driver APIs
router.post('/driver/login', (req, res) => {
  const { username, password } = req.body;
  // Mock login
  if (username && password) {
    res.json({ token: 'mock-jwt-token', driver_id: 'D123', name: 'Ramesh' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/bus-location', (req, res) => {
  const { bus_id, route_id, latitude, longitude, speed, status, timestamp } = req.body;
  
  // Update in-memory mock data
  const existingBusIndex = mockLiveBuses.findIndex(b => b.bus_id === bus_id);
  if (existingBusIndex >= 0) {
    mockLiveBuses[existingBusIndex] = {
      ...mockLiveBuses[existingBusIndex],
      latitude,
      longitude,
      speed,
      status: status || mockLiveBuses[existingBusIndex].status,
      last_updated: timestamp || new Date().toISOString()
    };
  } else {
    mockLiveBuses.push({
      bus_id,
      route_id,
      latitude,
      longitude,
      speed,
      status: status || 'On Time',
      next_stop: 'Unknown',
      eta_next_stop: 'Updating...',
      last_updated: timestamp || new Date().toISOString()
    });
  }

  res.json({ success: true, message: 'Location updated' });
});

router.get('/driver/route', (req, res) => {
  res.json(mockRoutes[0]); // Return a mock route for the driver
});

// Admin APIs
router.post('/admin/add-route', (req, res) => {
  res.json({ success: true, message: 'Route added' });
});

router.post('/admin/add-stop', (req, res) => {
  res.json({ success: true, message: 'Stop added' });
});

router.post('/admin/add-timing', (req, res) => {
  res.json({ success: true, message: 'Timing added' });
});

router.post('/admin/upload-csv', (req, res) => {
  res.json({ success: true, message: 'CSV uploaded and processed' });
});

router.post('/admin/announcements', (req, res) => {
  const { title, message, target_segment } = req.body;
  const newAnnouncement = {
    _id: `A${Date.now()}`,
    title,
    message,
    target_segment: target_segment || 'All',
    created_at: new Date().toISOString()
  };
  mockAnnouncements.unshift(newAnnouncement);
  
  // In a real app, we would emit this via Socket.io here
  // io.emit('passenger:announcement', newAnnouncement);
  
  res.json({ success: true, message: 'Announcement broadcasted', announcement: newAnnouncement });
});

router.get('/admin/feedback', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const feedbacks = await Feedback.find().sort({ created_at: -1 });
      return res.json(feedbacks);
    } else {
      return res.json(mockFeedback);
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

router.put('/admin/feedback/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    if (mongoose.connection.readyState === 1) {
      const updatedFeedback = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
      if (updatedFeedback) {
        return res.json({ success: true, message: 'Status updated', feedback: updatedFeedback });
      } else {
        return res.status(404).json({ error: 'Feedback not found' });
      }
    } else {
      const feedbackIndex = mockFeedback.findIndex(f => f._id === id);
      if (feedbackIndex >= 0) {
        mockFeedback[feedbackIndex].status = status;
        return res.json({ success: true, message: 'Status updated' });
      } else {
        return res.status(404).json({ error: 'Feedback not found' });
      }
    }
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ error: 'Failed to update feedback status' });
  }
});

export default router;
