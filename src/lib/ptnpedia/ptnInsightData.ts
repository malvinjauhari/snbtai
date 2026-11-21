import PTNRawData from '../../data/ptn-pedia-akademik-indonesia.json';
import { PTNInsightDataset, PTNUniversity } from './ptnInsightTypes';

const dataset = PTNRawData as PTNInsightDataset;

export function getAllPTNInsight(): PTNUniversity[] {
  return dataset.universities || [];
}

export function getPTNInsightById(id: string): PTNUniversity | undefined {
  return dataset.universities.find((u) => u.id === id);
}

export function searchPTNInsight(query: string, filters?: any): PTNUniversity[] {
  let results = dataset.universities;
  
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(ptn => 
      ptn.name.toLowerCase().includes(q) ||
      (ptn.short_name && ptn.short_name.toLowerCase().includes(q)) ||
      (ptn.location.city && ptn.location.city.toLowerCase().includes(q)) ||
      (ptn.location.province && ptn.location.province.toLowerCase().includes(q))
    );
  }
  
  if (filters) {
    if (filters.region && filters.region !== 'all') {
      results = results.filter(ptn => ptn.location.region === filters.region);
    }
    if (filters.type && filters.type !== 'all') {
      results = results.filter(ptn => ptn.type === filters.type);
    }
    if (filters.confidence && filters.confidence !== 'all') {
      results = results.filter(ptn => ptn.data_quality.confidence_level === filters.confidence);
    }
  }

  return results;
}

export function getPTNRegions(): string[] {
  const regions = new Set<string>();
  dataset.universities.forEach(u => {
    if (u.location.region) regions.add(u.location.region);
  });
  return Array.from(regions).sort();
}
