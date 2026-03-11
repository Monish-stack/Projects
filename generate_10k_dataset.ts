import fs from 'fs';

const cities = [
  "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Erode", "Vellore", 
  "Thanjavur", "Tirunelveli", "Theni", "Tiruvannamalai", "Tiruvarur", "Kanyakumari", 
  "Cuddalore", "Villupuram", "Dharmapuri", "Krishnagiri", "Namakkal", "Karur", 
  "Dindigul", "Tiruppur", "Chengalpattu", "Ranipet", "Kallakurichi", "Mayiladuthurai", 
  "Nagapattinam", "Nilgiris", "Pudukkottai", "Ramanathapuram", "Sivaganga", 
  "Thoothukudi", "Virudhunagar", "Tenkasi", "Ariyalur", "Perambalur"
];

const busTypes = ["Express", "Ultra Deluxe", "AC Sleeper", "Non AC Seater", "Deluxe", "Super Fast"];

const popularRoutes = [
  { s: "Chennai", d: "Coimbatore", dist: 500 },
  { s: "Coimbatore", d: "Chennai", dist: 500 },
  { s: "Chennai", d: "Madurai", dist: 450 },
  { s: "Madurai", d: "Chennai", dist: 450 },
  { s: "Chennai", d: "Trichy", dist: 330 },
  { s: "Trichy", d: "Chennai", dist: 330 },
];

const cityCodes: Record<string, string> = {
  "Chennai": "CHN",
  "Coimbatore": "CBE",
  "Madurai": "MDU",
  "Trichy": "TRY",
  "Salem": "SLM",
  "Erode": "ERD",
  "Vellore": "VLR",
  "Thanjavur": "TNJ",
  "Tirunelveli": "TNV",
  "Theni": "TNI"
};

function getCityCode(city: string) {
  return cityCodes[city] || city.substring(0, 3).toUpperCase();
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function generate() {
  const routes: string[] = [];
  routes.push("bus_number,bus_type,source,destination,departure_time,arrival_time,ticket_price_rs,available_seats,distance_km");

  let count = 0;

  // Generate popular routes (at least 200 each)
  for (const route of popularRoutes) {
    for (let i = 0; i < 250; i++) {
      const type = busTypes[Math.floor(Math.random() * busTypes.length)];
      const depMins = (Math.floor(Math.random() * 48) * 30); // Every 30 mins
      const travelTime = Math.floor((route.dist / 50) * 60);
      const arrMins = depMins + travelTime;
      
      const busNo = `TNSTC-${getCityCode(route.s)}-${1000 + count}`;
      const price = Math.floor(route.dist * 1.5);
      const seats = 10 + Math.floor(Math.random() * 36);
      
      routes.push(`${busNo},${type},${route.s},${route.d},${formatTime(depMins)},${formatTime(arrMins)},${price},${seats},${route.dist}`);
      count++;
    }
  }

  // Generate random routes for the remaining
  while (count < 10000) {
    const sIdx = Math.floor(Math.random() * cities.length);
    let dIdx = Math.floor(Math.random() * cities.length);
    while (sIdx === dIdx) dIdx = Math.floor(Math.random() * cities.length);
    
    const s = cities[sIdx];
    const d = cities[dIdx];
    const dist = 50 + Math.floor(Math.random() * 550);
    const type = busTypes[Math.floor(Math.random() * busTypes.length)];
    const depMins = (Math.floor(Math.random() * 24) * 60) + (Math.random() > 0.5 ? 30 : 0);
    const travelTime = Math.floor((dist / 45) * 60); // Slightly slower for random routes
    const arrMins = depMins + travelTime;
    
    const busNo = `TNSTC-${getCityCode(s)}-${1000 + count}`;
    const price = Math.floor(dist * 1.5);
    const seats = 10 + Math.floor(Math.random() * 36);
    
    routes.push(`${busNo},${type},${s},${d},${formatTime(depMins)},${formatTime(arrMins)},${price},${seats},${dist}`);
    count++;
  }

  fs.writeFileSync('tnstc_10000_routes_dataset.csv', routes.join('\n'));
  console.log('Generated 10,000 routes in tnstc_10000_routes_dataset.csv');
}

generate();
