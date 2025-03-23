// utils/api.ts
export interface ParsedBreadcrumb {
    title: string | null;
    chapter: string | null;
    subchapter: string | null;
    part: string | null;
    subpart: string | null;
    section: string | null;
    subtitle?: string | null;
  }
  
  export function parseBreadcrumb(breadcrumb: string): ParsedBreadcrumb {
    const parsed: ParsedBreadcrumb = {
      title: null,
      chapter: null,
      subchapter: null,
      part: null,
      subpart: null,
      section: null,
      subtitle: null,
    };
  
    // Split breadcrumb into components
    const components = breadcrumb.split(" > ");
    components.forEach(component => {
      const keyValue = component.split(": ");
      if (keyValue.length === 2) {
        let key = keyValue[0].trim().toLowerCase();
        let value = keyValue[1].trim();
  
        // Map recognized keys (using bracket notation so TS accepts dynamic keys)
        if (key in parsed) {
          (parsed as any)[key] = value;
        }
      }
    });
  
    return parsed;
  }
  
  export async function fetchParsedSection(
    parsed: ParsedBreadcrumb,
    issueDate: string
  ): Promise<string> {
    if (!parsed.title || !parsed.section) {
      throw new Error("Title and Section are required to fetch data.");
    }
  
    const baseUrl = "https://www.ecfr.gov/api/versioner/v1/full";
  
    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (parsed.subtitle) queryParams.append("subtitle", parsed.subtitle);
    if (parsed.chapter) queryParams.append("chapter", parsed.chapter);
    if (parsed.subchapter) queryParams.append("subchapter", parsed.subchapter);
    if (parsed.part) queryParams.append("part", parsed.part);
    if (parsed.subpart) queryParams.append("subpart", parsed.subpart);
    if (parsed.section) queryParams.append("section", parsed.section);
  
    // Construct full URL
    const url = `${baseUrl}/${issueDate}/title-${parsed.title}.xml?${queryParams.toString()}`;
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/xml",
        },
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      return await response.text();
    } catch (error) {
      console.error("Error fetching section:", error);
      throw error;
    }
  }
  
  export async function fetchSection(breadcrumb: string, issueDate: string): Promise<string> {
    console.log("Breadcrumb:", breadcrumb);
    const parsed = parseBreadcrumb(breadcrumb);
    console.log("Parsed Breadcrumb:", parsed);
  
    return fetchParsedSection(parsed, issueDate);
  }
  
  export interface Title {
    id: string;
    name: string;
    latestIssue: string;
    lastUpdated: string;
  }
  
  export async function fetchTitles(): Promise<Title[]> {
    try {
      const response = await fetch("https://www.ecfr.gov/api/versioner/v1/titles.json");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
  
      return data.titles
        .filter((title: any) => !title.reserved)
        .map((title: any) => ({
          id: title.number,
          name: title.name,
          latestIssue: title.latest_issue_date,
          lastUpdated: title.latest_amended_on,
        }));
    } catch (error) {
      console.error("Error fetching titles:", error);
      return [];
    }
  }
  
  export async function fetchTitleStructure(titleNumber: string, issueDate: string): Promise<any> {
    try {
      const response = await fetch(
        `https://www.ecfr.gov/api/versioner/v1/structure/${issueDate}/title-${titleNumber}.json`
      );
      if (!response.ok) throw new Error("Failed to fetch title structure");
      return await response.json();
    } catch (error) {
      console.error("Error fetching title structure:", error);
      return null;
    }
  }
  
  export async function fetchAmendments(titleId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://www.ecfr.gov/api/versioner/v1/versions/title-${titleId}.json`
      );
      if (!response.ok) throw new Error("Failed to fetch amendments");
      return await response.json();
    } catch (error) {
      console.error("Error fetching amendments:", error);
      return null;
    }
  }
  
  export async function fetchSearchResults(query: string): Promise<string | null> {
    if (!query.trim()) return null; // Ignore empty queries
  
    const url = `https://www.ecfr.gov/api/search/v1/results?query=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.text();
    } catch (error) {
      console.error("Search API Error:", error);
      return `<p class="text-red-500">Error fetching results</p>`;
    }
  }
  