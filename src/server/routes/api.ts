import { Router } from 'express';
import mongoose from 'mongoose';
import { mockRoutes, mockStops, mockTimings, mockLiveBuses, mockAnnouncements, mockFeedback } from '../data/mockData.js';
import { Feedback } from '../models/index.js';
import { GoogleGenAI } from '@google/genai';

const router = Router();

// Passenger APIs
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

router.get('/buses', (req, res) => {
  const { from, to } = req.query;
  let filteredRoutes = mockRoutes;
  
  // Simulate an error if the user searches for a specific keyword or if they search for same district
  if (from && to && (from as string).toLowerCase() === (to as string).toLowerCase()) {
    return res.status(400).json({ error: 'Source and destination cannot be the same district.' });
  }

  if (from && to) {
    filteredRoutes = mockRoutes.filter(r => 
      (r.source.toLowerCase() === (from as string).toLowerCase() || r.stops.some(s => s.toLowerCase().includes((from as string).toLowerCase()))) &&
      (r.destination.toLowerCase() === (to as string).toLowerCase() || r.stops.some(s => s.toLowerCase().includes((to as string).toLowerCase())))
    );
  }

  // Attach timings to routes
  const routesWithTimings = filteredRoutes.map(route => {
    const timings = mockTimings.filter(t => t.route_id === route._id);
    return { ...route, timings };
  });

  res.json(routesWithTimings);
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
  const { bus_id, latitude, longitude, timestamp } = req.body;
  // In a real app, this would update the database and broadcast via socket.io
  // Here we just acknowledge
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
