import mongoose from 'mongoose';
import { BusRoute } from '../models/BusRoute';

export interface AnalyticsResult {
  stats: {
    topSources: { name: string; count: number }[];
    topDestinations: { name: string; count: number }[];
    avgPrice: number;
    totalRoutes: number;
  };
  demandGaps: {
    source: string;
    destination: string;
    potential: number;
    reason: string;
  }[];
  profitabilityScores: {
    route: string;
    score: number;
  }[];
  recommendations: {
    route: string;
    demand: 'High' | 'Medium' | 'Low';
    suggestedPrice: number;
  }[];
  graphData: {
    nodes: { id: string }[];
    links: { source: string; target: string; value: number }[];
  };
}

export class AnalyticsEngine {
  static async generateAnalytics(): Promise<AnalyticsResult> {
    let routes = [];
    
    try {
      if (mongoose.connection.readyState === 1) {
        routes = await BusRoute.find({});
      } else {
        console.warn('MongoDB not connected. Using fallback data for AnalyticsEngine.');
        routes = this.getFallbackRoutes();
      }
    } catch (error) {
      console.error('Analytics query error:', error);
      routes = this.getFallbackRoutes();
    }
    
    // 1. Basic Stats
    const sourceCounts: Record<string, number> = {};
    const destCounts: Record<string, number> = {};
    let totalPrice = 0;

    routes.forEach(r => {
      sourceCounts[r.source] = (sourceCounts[r.source] || 0) + 1;
      destCounts[r.destination] = (destCounts[r.destination] || 0) + 1;
      totalPrice += r.ticket_price_rs;
    });

    const topSources = Object.entries(sourceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topDestinations = Object.entries(destCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 2. Graph Connectivity
    const cities = Array.from(new Set([...Object.keys(sourceCounts), ...Object.keys(destCounts)]));
    const adj: Record<string, Set<string>> = {};
    cities.forEach(c => adj[c] = new Set());
    routes.forEach(r => adj[r.source].add(r.destination));

    // 3. Demand Gap Detection
    const demandGaps: AnalyticsResult['demandGaps'] = [];
    const directPairs = new Set(routes.map(r => `${r.source}->${r.destination}`));

    for (const s of cities) {
      for (const mid of adj[s]) {
        for (const d of adj[mid]) {
          if (s !== d && !directPairs.has(`${s}->${d}`)) {
            const potential = (sourceCounts[s] || 0) + (destCounts[d] || 0);
            if (potential > 50) {
              demandGaps.push({
                source: s,
                destination: d,
                potential,
                reason: `High traffic cities (${s}, ${d}) currently connected only via ${mid}.`
              });
            }
          }
        }
      }
    }

    const uniqueGaps = Array.from(new Map(demandGaps.map(g => [`${g.source}->${g.destination}`, g])).values())
      .sort((a, b) => b.potential - a.potential)
      .slice(0, 10);

    // 4. Profitability Scores
    const profitabilityScores = routes.slice(0, 20).map(r => {
      const score = Math.min(100, Math.floor((r.ticket_price_rs / 10) + (50 - r.available_seats)));
      return {
        route: `${r.source} → ${r.destination}`,
        score
      };
    });

    // 5. Recommendations
    const recommendations = uniqueGaps.slice(0, 5).map(gap => ({
      route: `${gap.source} → ${gap.destination}`,
      demand: gap.potential > 100 ? 'High' : 'Medium' as any,
      suggestedPrice: Math.floor(300 + Math.random() * 200)
    }));

    // 6. Graph Data for D3
    const graphData = {
      nodes: cities.slice(0, 30).map(c => ({ id: c })),
      links: routes.slice(0, 50).map(r => ({
        source: r.source,
        target: r.destination,
        value: 1
      })).filter(l => cities.slice(0, 30).includes(l.source) && cities.slice(0, 30).includes(l.target))
    };

    return {
      stats: {
        topSources,
        topDestinations,
        avgPrice: routes.length ? totalPrice / routes.length : 0,
        totalRoutes: routes.length
      },
      demandGaps: uniqueGaps,
      profitabilityScores,
      recommendations,
      graphData
    };
  }

  private static getFallbackRoutes() {
    return [
      { source: "Chennai", destination: "Madurai", ticket_price_rs: 450, available_seats: 32 },
      { source: "Chennai", destination: "Coimbatore", ticket_price_rs: 550, available_seats: 22 },
      { source: "Madurai", destination: "Chennai", ticket_price_rs: 450, available_seats: 28 },
      { source: "Coimbatore", destination: "Chennai", ticket_price_rs: 950, available_seats: 8 },
      { source: "Trichy", destination: "Chennai", ticket_price_rs: 380, available_seats: 40 },
      { source: "Chennai", destination: "Trichy", ticket_price_rs: 380, available_seats: 35 },
      { source: "Salem", destination: "Chennai", ticket_price_rs: 520, available_seats: 18 },
      { source: "Chennai", destination: "Salem", ticket_price_rs: 420, available_seats: 25 },
    ];
  }
}
