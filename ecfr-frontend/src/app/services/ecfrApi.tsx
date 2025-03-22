// app/services/ecfrApi.ts

const BASE_URL = 'https://www.ecfr.gov';

/**
 * Service for fetching data from the eCFR API
 */
export class EcfrApiService {
  /**
   * Fetch all agencies
   */
  static async getAgencies() {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/v1/agencies.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch agencies: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching agencies:', error);
      throw error;
    }
  }

  /**
   * Fetch all titles summary information
   */
  static async getTitles() {
    try {
      const response = await fetch(`${BASE_URL}/api/versioner/v1/titles.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch titles: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching titles:', error);
      throw error;
    }
  }

  /**
   * Fetch structure JSON for a title on a specific date
   */
  static async getTitleStructure(titleNumber: number, date: string = 'current') {
    try {
      const response = await fetch(`${BASE_URL}/api/versioner/v1/structure/${date}/title-${titleNumber}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch title structure: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching structure for title ${titleNumber}:`, error);
      throw error;
    }
  }

  /**
   * Fetch full XML content for a title on a specific date
   */
  static async getTitleContent(titleNumber: number, date: string = 'current') {
    try {
      const response = await fetch(`${BASE_URL}/api/versioner/v1/full/${date}/title-${titleNumber}.xml`);
      if (!response.ok) {
        throw new Error(`Failed to fetch title content: ${response.status}`);
      }
      return await response.text(); // Return as XML text
    } catch (error) {
      console.error(`Error fetching content for title ${titleNumber}:`, error);
      throw error;
    }
  }

  /**
   * Fetch all versions of a title
   */
  static async getTitleVersions(titleNumber: number) {
    try {
      const response = await fetch(`${BASE_URL}/api/versioner/v1/versions/title-${titleNumber}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch title versions: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching versions for title ${titleNumber}:`, error);
      throw error;
    }
  }

  /**
   * Search the eCFR with a query
   */
  static async searchEcfr(query: string, page: number = 1, resultPerPage: number = 20) {
    try {
      const url = new URL(`${BASE_URL}/api/search/v1/results`);
      url.searchParams.append('query', query);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('resultsPerPage', resultPerPage.toString());
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to search eCFR: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching eCFR:', error);
      throw error;
    }
  }

  /**
   * Get search result counts by date
   */
  static async getSearchCountsByDate(query: string) {
    try {
      const url = new URL(`${BASE_URL}/api/search/v1/counts/daily`);
      url.searchParams.append('query', query);
      
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to get search counts: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting search counts by date:', error);
      throw error;
    }
  }

  /**
   * Get all corrections for a title
   */
  static async getTitleCorrections(titleNumber: number) {
    try {
      const response = await fetch(`${BASE_URL}/api/admin/v1/corrections/title/${titleNumber}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch corrections: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching corrections for title ${titleNumber}:`, error);
      throw error;
    }
  }
}