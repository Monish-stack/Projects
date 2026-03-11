import fs from 'fs';
import path from 'path';

const cities = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", 
  "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", 
  "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", 
  "Thoothukudi", "Trichy", "Tirunelveli", "Tirupathur", "Tirupur", "Tiruvallur", 
  "Tiruvannamalai", "Tiruvarur", "Vellore", "Villupuram", "Virudhunagar", "Ambur"
];

const types = ['Express', 'Deluxe', 'AC Sleeper', 'Government', 'Ultra Deluxe', 'Sleeper', 'AC Seater'];

function randomTime() {
  const h = Math.floor(Math.random() * 24);
  const m = Math.floor(Math.random() * 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr12 = h % 12 || 12;
  return `${hr12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function addTime(timeStr: string, hours: number, mins: number) {
  const [time, ampm] = timeStr.split(' ');
  let [h, m] = time.split(':').map(Number);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  
  h += hours;
  m += mins;
  h += Math.floor(m / 60);
  m = m % 60;
  h = h % 24;
  
  const newAmpm = h >= 12 ? 'PM' : 'AM';
  const newHr12 = h % 12 || 12;
  return `${newHr12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${newAmpm}`;
}

let csv = "bus_number,bus_type,source,destination,departure_time,arrival_time,ticket_price_rs,available_seats\n";

for (let i = 0; i < 5000; i++) {
  const source = cities[Math.floor(Math.random() * cities.length)];
  let destination = cities[Math.floor(Math.random() * cities.length)];
  while (source === destination) {
    destination = cities[Math.floor(Math.random() * cities.length)];
  }
  
  const bus_number = `TNSTC ${1000 + Math.floor(Math.random() * 8999)}`;
  const bus_type = types[Math.floor(Math.random() * types.length)];
  
  const depTime = randomTime();
  const durationH = 2 + Math.floor(Math.random() * 8);
  const durationM = Math.floor(Math.random() * 60);
  const arrTime = addTime(depTime, durationH, durationM);
  
  const price = 150 + Math.floor(Math.random() * 50) * 10;
  const seats = Math.floor(Math.random() * 40) + 1;
  
  csv += `${bus_number},${bus_type},${source},${destination},${depTime},${arrTime},${price},${seats}\n`;
}

const dir = path.join(process.cwd(), 'src', 'server', 'data');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(path.join(dir, 'tnstc_5000_routes_dataset.csv'), csv);
console.log("CSV generated successfully.");
