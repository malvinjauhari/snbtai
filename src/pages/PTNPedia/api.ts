import { University, Program } from './types';

const BACKEND_URL = (import.meta as any).env.VITE_BACKEND_URL || 'https://ptnpedia-snbtai-api.vercel.app';

export const PTNPediaAPI = {
  async getUniversities(category = 'akademik'): Promise<University[]> {
    try {
      console.log(`[PTNPediaAPI] Fetching universities for category: ${category}`);
      const response = await fetch(`${BACKEND_URL}/api/universities?category=${category}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      const payload = await response.json();
      const data = Array.isArray(payload) ? payload : (payload.data || []);
      
      console.log(`[PTNPediaAPI] Successfully fetched ${data.length} universities`);
      return data;
    } catch (error) {
      console.error('[PTNPediaAPI] Error in getUniversities:', error);
      throw error;
    }
  },

  async getPrograms(universityCode: string): Promise<Program[]> {
    try {
      console.log(`[PTNPediaAPI] Fetching programs for university: ${universityCode}`);
      const response = await fetch(`${BACKEND_URL}/api/programs?code=${universityCode}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      const payload = await response.json();
      const data = Array.isArray(payload) ? payload : (payload.data || []);
      
      console.log(`[PTNPediaAPI] Successfully fetched ${data.length} programs`);
      return data;
    } catch (error) {
      console.error('[PTNPediaAPI] Error in getPrograms:', error);
      throw error;
    }
  }
};
