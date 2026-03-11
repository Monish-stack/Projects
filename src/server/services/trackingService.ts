import { Server } from 'socket.io';
import { BusLocation } from '../models/BusLocation.js';

const TAMIL_NADU_CITIES = [
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Vellore", lat: 12.9165, lng: 79.1325 },
  { name: "Salem", lat: 11.6643, lng: 78.1460 },
  { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Trichy", lat: 10.7905, lng: 78.7047 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
  { name: "Kanyakumari", lat: 8.0883, lng: 77.5385 }
];

const ROUTES = [
  {
    id: "R1",
    path: [
      { name: "Chennai", lat: 13.0827, lng: 80.2707 },
      { name: "Vellore", lat: 12.9165, lng: 79.1325 },
      { name: "Salem", lat: 11.6643, lng: 78.1460 },
      { name: "Coimbatore", lat: 11.0168, lng: 76.9558 }
    ]
  },
  {
    id: "R2",
    path: [
      { name: "Chennai", lat: 13.0827, lng: 80.2707 },
      { name: "Trichy", lat: 10.7905, lng: 78.7047 },
      { name: "Madurai", lat: 9.9252, lng: 78.1198 },
      { name: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
      { name: "Kanyakumari", lat: 8.0883, lng: 77.5385 }
    ]
  }
];

class TrackingService {
  private io: Server | null = null;
  private interval: NodeJS.Timeout | null = null;
  private activeBuses: any[] = [];

  public init(io: Server) {
    this.io = io;
    this.seedInitialBuses();
    this.startSimulation();
  }

  private seedInitialBuses() {
    this.activeBuses = [
      {
        bus_number: "TNSTC-CHN-2145",
        route_id: "R1",
        source: "Chennai",
        destination: "Coimbatore",
        latitude: 13.0827,
        longitude: 80.2707,
        speed: 60,
        next_stop: "Vellore",
        status: "Running",
        route_path: ROUTES[0].path,
        progress: 0 // 0 to 1
      },
      {
        bus_number: "TNSTC-MDU-5581",
        route_id: "R2",
        source: "Chennai",
        destination: "Kanyakumari",
        latitude: 13.0827,
        longitude: 80.2707,
        speed: 55,
        next_stop: "Trichy",
        status: "Running",
        route_path: ROUTES[1].path,
        progress: 0.1
      },
      {
        bus_number: "TNSTC-CBE-8890",
        route_id: "R1",
        source: "Coimbatore",
        destination: "Chennai",
        latitude: 11.0168,
        longitude: 76.9558,
        speed: 65,
        next_stop: "Salem",
        status: "Running",
        route_path: [...ROUTES[0].path].reverse(),
        progress: 0.05
      }
    ];
  }

  private startSimulation() {
    if (this.interval) clearInterval(this.interval);

    this.interval = setInterval(() => {
      this.updatePositions();
      if (this.io) {
        this.io.emit('passenger:all_buses', this.activeBuses);
      }
    }, 5000);
  }

  private updatePositions() {
    this.activeBuses = this.activeBuses.map(bus => {
      // Advance progress
      bus.progress += 0.005; // Move 0.5% of the route every 5 seconds
      if (bus.progress > 1) bus.progress = 0;

      // Calculate new lat/lng based on progress along the path
      const path = bus.route_path;
      const totalSegments = path.length - 1;
      const segmentIndex = Math.floor(bus.progress * totalSegments);
      const segmentProgress = (bus.progress * totalSegments) % 1;

      if (segmentIndex < totalSegments) {
        const start = path[segmentIndex];
        const end = path[segmentIndex + 1];

        bus.latitude = start.lat + (end.lat - start.lat) * segmentProgress;
        bus.longitude = start.lng + (end.lng - start.lng) * segmentProgress;
        bus.next_stop = end.name;
        bus.speed = 50 + Math.floor(Math.random() * 20); // Fluctuating speed
      }

      return { ...bus, last_updated: new Date() };
    });
  }

  public getActiveBuses() {
    return this.activeBuses;
  }
}

export const trackingService = new TrackingService();
