import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { BusRoute as BusRouteModel } from '../models/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface BusRoute {
  _id?: string;
  bus_number: string;
  bus_type: string;
  source: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  ticket_price_rs: number;
  available_seats: number;
  duration_mins: number;
}

export interface RouteOption {
  type: 'direct' | 'connecting';
  total_price: number;
  total_duration_mins: number;
  buses: BusRoute[];
}

// Helper to parse time string "HH:MM" to minutes from midnight
function parseTime(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function calculateDuration(depTime: string, arrTime: string): number {
  const dep = parseTime(depTime);
  let arr = parseTime(arrTime);
  if (arr < dep) {
    arr += 24 * 60; // Next day
  }
  return arr - dep;
}

export function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m > 0 ? m + 'm' : ''}`.trim();
}

class RouteEngine {
  private buses: BusRoute[] = [];
  private graph: Map<string, BusRoute[]> = new Map();
  private isLoaded = false;

  constructor() {
    // We will call loadDataset explicitly after DB connection
  }

  public async loadDataset() {
    try {
      let routes = [];
      
      // Try loading from CSV first as requested
      const csvPath = path.join(__dirname, '../../tnstc_10000_routes_dataset.csv');
      if (fs.existsSync(csvPath)) {
        console.log(`Loading dataset from CSV: ${csvPath}`);
        const csvData = fs.readFileSync(csvPath, 'utf-8');
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          if (values.length < 8) continue;
          
          routes.push({
            bus_number: values[0],
            bus_type: values[1],
            source: values[2],
            destination: values[3],
            departure_time: values[4],
            arrival_time: values[5],
            ticket_price_rs: parseInt(values[6]),
            available_seats: parseInt(values[7])
          });
        }
        console.log(`Loaded routes from CSV: ${routes.length}`);
      } else if (mongoose.connection.readyState === 1) {
        // Fallback to MongoDB
        routes = await BusRouteModel.find({}).lean();
        console.log(`Loaded routes from MongoDB: ${routes.length}`);
      } else {
        console.warn('CSV not found and MongoDB not connected. Using fallback mock data.');
        routes = this.getFallbackData();
      }
      
      if (routes.length === 0) {
        console.warn('Dataset is empty. Adding sample test routes.');
        routes = this.getFallbackData();
      }

      this.processRoutes(routes);
    } catch (error) {
      console.error('Failed to load dataset:', error);
      // Fallback to mock data on error
      const routes = this.getFallbackData();
      this.processRoutes(routes);
    }
  }

  private processRoutes(routes: any[]) {
    this.buses = [];
    this.graph.clear();

    for (const route of routes) {
      const duration_mins = calculateDuration(route.departure_time, route.arrival_time);

      const bus: BusRoute = {
        _id: route._id?.toString() || `mock_${Math.random().toString(36).substr(2, 9)}`,
        bus_number: route.bus_number,
        bus_type: route.bus_type,
        source: route.source.trim(),
        destination: route.destination.trim(),
        departure_time: route.departure_time,
        arrival_time: route.arrival_time,
        ticket_price_rs: route.ticket_price_rs,
        available_seats: route.available_seats,
        duration_mins
      };

      this.buses.push(bus);

      if (!this.graph.has(bus.source)) {
        this.graph.set(bus.source, []);
      }
      this.graph.get(bus.source)!.push(bus);
    }
    this.isLoaded = true;
  }

  private getFallbackData() {
    return [
      { bus_number: "TN-01-1001", bus_type: "Express", source: "Chennai", destination: "Coimbatore", departure_time: "06:30", arrival_time: "14:45", ticket_price_rs: 450, available_seats: 32 },
      { bus_number: "TN-01-1002", bus_type: "Ultra Deluxe", source: "Chennai", destination: "Madurai", departure_time: "21:00", arrival_time: "05:15", ticket_price_rs: 680, available_seats: 14 },
      { bus_number: "TN-02-2001", bus_type: "Express", source: "Madurai", destination: "Chennai", departure_time: "07:15", arrival_time: "15:30", ticket_price_rs: 450, available_seats: 28 },
      { bus_number: "TN-03-3001", bus_type: "Super Fast", source: "Chennai", destination: "Trichy", departure_time: "08:00", arrival_time: "13:30", ticket_price_rs: 350, available_seats: 22 },
      { bus_number: "TN-04-4001", bus_type: "AC Sleeper", source: "Coimbatore", destination: "Chennai", departure_time: "22:00", arrival_time: "06:30", ticket_price_rs: 950, available_seats: 8 },
      { bus_number: "TN-05-5001", bus_type: "Express", source: "Trichy", destination: "Chennai", departure_time: "05:45", arrival_time: "12:15", ticket_price_rs: 380, available_seats: 40 },
      { bus_number: "TN-06-6001", bus_type: "Express", source: "Chennai", destination: "Trichy", departure_time: "14:30", arrival_time: "21:00", ticket_price_rs: 380, available_seats: 35 },
      { bus_number: "TN-07-7001", bus_type: "Ultra Deluxe", source: "Salem", destination: "Chennai", departure_time: "23:00", arrival_time: "06:00", ticket_price_rs: 520, available_seats: 18 },
      { bus_number: "TN-08-8001", bus_type: "Express", source: "Chennai", destination: "Salem", departure_time: "09:30", arrival_time: "16:30", ticket_price_rs: 420, available_seats: 25 },
      { bus_number: "TN-09-9001", bus_type: "Express", source: "Madurai", destination: "Coimbatore", departure_time: "10:30", arrival_time: "15:30", ticket_price_rs: 320, available_seats: 20 },
    ];
  }

  public async findRoutes(source: string, destination: string): Promise<RouteOption[]> {
    if (!this.isLoaded) {
      await this.loadDataset();
    }

    const src = source.trim().toLowerCase();
    const dest = destination.trim().toLowerCase();
    
    console.log(`Searching route: ${source} (${src}) → ${destination} (${dest})`);
    
    const options: RouteOption[] = [];

    // 1. Direct Routes
    const directBuses = this.buses.filter(b => 
      b.source.trim().toLowerCase() === src && b.destination.trim().toLowerCase() === dest
    );

    for (const bus of directBuses) {
      options.push({
        type: 'direct',
        total_price: bus.ticket_price_rs,
        total_duration_mins: bus.duration_mins,
        buses: [bus]
      });
    }

    console.log(`Direct routes found: ${options.length}`);

    // 2. Connecting Routes (1 Transfer) - BFS approach
    // To avoid too many results, we limit the number of connecting routes
    if (options.length < 5) {
      const srcBuses = this.buses.filter(b => b.source.trim().toLowerCase() === src);
      
      for (const bus1 of srcBuses) {
        const intermediate = bus1.destination.trim().toLowerCase();
        
        // Find buses from intermediate to destination
        const connectingBuses = this.buses.filter(b => 
          b.source.trim().toLowerCase() === intermediate && 
          b.destination.trim().toLowerCase() === dest
        );

        for (const bus2 of connectingBuses) {
          // Check if transfer is feasible (bus2 departs after bus1 arrives)
          const arrTime1 = parseTime(bus1.arrival_time);
          let depTime2 = parseTime(bus2.departure_time);
          
          if (depTime2 < arrTime1) {
            depTime2 += 24 * 60; // Next day
          }
          
          const layover = depTime2 - arrTime1;
          
          // Layover between 30 mins and 8 hours
          if (layover >= 30 && layover <= 480) {
            options.push({
              type: 'connecting',
              total_price: bus1.ticket_price_rs + bus2.ticket_price_rs,
              total_duration_mins: bus1.duration_mins + layover + bus2.duration_mins,
              buses: [bus1, bus2]
            });
          }
        }
      }
    }

    console.log(`Total routes found (including connecting): ${options.length}`);

    // Sort options: Direct first, then by duration, then by price
    options.sort((a, b) => {
      if (a.type === 'direct' && b.type === 'connecting') return -1;
      if (a.type === 'connecting' && b.type === 'direct') return 1;
      if (a.total_duration_mins !== b.total_duration_mins) {
        return a.total_duration_mins - b.total_duration_mins;
      }
      return a.total_price - b.total_price;
    });

    return options.slice(0, 20);
  }
}

export const routeEngine = new RouteEngine();
