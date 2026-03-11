export const mockRoutes = [
  {
    _id: "R001",
    bus_number: "100A",
    operator: "TNSTC",
    source: "Chennai",
    destination: "Vellore",
    distance: 140,
    stops: ["Chennai CMBT", "Poonamallee", "Sriperumbudur", "Kanchipuram Bypass", "Vellore"],
    district: "Chennai",
    villages_covered: ["Sriperumbudur", "Sunguvarchatram"]
  },
  {
    _id: "R002",
    bus_number: "SETC-500",
    operator: "SETC",
    source: "Chennai",
    destination: "Madurai",
    distance: 460,
    stops: ["Chennai CMBT", "Tambaram", "Chengalpattu", "Villupuram", "Trichy", "Madurai"],
    district: "Multiple",
    villages_covered: []
  },
  {
    _id: "R003",
    bus_number: "33",
    operator: "TNSTC",
    source: "Coimbatore",
    destination: "Tiruppur",
    distance: 55,
    stops: ["Gandhipuram", "Singanallur", "Palladam", "Tiruppur Old Bus Stand"],
    district: "Coimbatore",
    villages_covered: ["Karanampettai", "Palladam"]
  },
  {
    _id: "R004",
    bus_number: "N-E-101",
    operator: "TNSTC",
    source: "Namakkal",
    destination: "Erode",
    distance: 65,
    stops: ["Namakkal Bus Stand", "Tiruchengode", "Erode Bus Stand"],
    district: "Namakkal",
    villages_covered: ["Tiruchengode"]
  }
];

export const mockStops = [
  { _id: "S001", route_id: "R001", name: "Chennai CMBT", latitude: 13.0674, longitude: 80.2056, sequence: 1 },
  { _id: "S002", route_id: "R001", name: "Poonamallee", latitude: 13.0473, longitude: 80.0945, sequence: 2 },
  { _id: "S003", route_id: "R001", name: "Vellore", latitude: 12.9165, longitude: 79.1325, sequence: 5 },
];

export const mockTimings = [
  { _id: "T001", route_id: "R001", departure_time: "06:00", arrival_time: "09:00", days_of_operation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { _id: "T002", route_id: "R001", departure_time: "08:00", arrival_time: "11:00", days_of_operation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { _id: "T003", route_id: "R002", departure_time: "20:00", arrival_time: "04:30", days_of_operation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { _id: "T004", route_id: "R004", departure_time: "07:30", arrival_time: "09:00", days_of_operation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { _id: "T005", route_id: "R004", departure_time: "14:15", arrival_time: "15:45", days_of_operation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  { _id: "T006", route_id: "R004", departure_time: "18:00", arrival_time: "19:30", days_of_operation: ["Mon", "Tue", "Wed", "Thu", "Fri"] }
];

export const mockLiveBuses = [
  { bus_id: "TN01AB1234", route_id: "R001", latitude: 13.0500, longitude: 80.1000, speed: 45, status: "On Time", next_stop: "Sriperumbudur", eta_next_stop: "15 mins", last_updated: new Date().toISOString() },
  { bus_id: "TN07CD5678", route_id: "R002", latitude: 11.9401, longitude: 79.4861, speed: 60, status: "Delayed", next_stop: "Villupuram", eta_next_stop: "10 mins", last_updated: new Date().toISOString() },
];

export const mockAnnouncements = [
  { _id: "A001", title: "Heavy Rain Alert", message: "Buses in Chennai and Kanchipuram districts may experience delays of up to 30 minutes due to heavy rainfall.", target_segment: "Chennai", created_at: new Date().toISOString() },
  { _id: "A002", title: "New Route Added", message: "We have added a new direct route from Coimbatore to Madurai (Route 44). Check timings in the app.", target_segment: "All", created_at: new Date(Date.now() - 86400000).toISOString() }
];

export const mockFeedback = [
  { _id: "F001", category: "Timing Inaccuracy", description: "Bus 100A arrived 20 minutes late at Poonamallee stop today.", status: "Pending", created_at: new Date().toISOString() },
  { _id: "F002", category: "Driver Conduct", description: "Driver of SETC-500 was driving very rashly near Tambaram.", status: "Reviewed", created_at: new Date(Date.now() - 3600000).toISOString() }
];
