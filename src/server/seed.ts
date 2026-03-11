import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { BusRoute } from './models/BusRoute.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const filePath = path.join(process.cwd(), 'src', 'server', 'data', 'tnstc_5000_routes_dataset.csv');
    if (!fs.existsSync(filePath)) {
      console.error('CSV file not found at:', filePath);
      process.exit(1);
    }

    const csvData = fs.readFileSync(filePath, 'utf-8');
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');

    const routes = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        routes.push({
          bus_number: values[0],
          bus_type: values[1],
          source: values[2],
          destination: values[3],
          departure_time: values[4],
          arrival_time: values[5],
          ticket_price_rs: parseFloat(values[6]),
          available_seats: parseInt(values[7], 10),
        });
      }
    }

    await BusRoute.deleteMany({});
    console.log('Cleared existing bus routes');

    await BusRoute.insertMany(routes);
    console.log(`Successfully seeded ${routes.length} bus routes`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
