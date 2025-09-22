const API_BASE_URL = 'http://localhost:8000/api';

export class ApiClient {
	constructor(private fetch: typeof globalThis.fetch) {}

	private async checkStatus(resp: Response, name: string) {
		if (resp.status === 200) {
			return resp.json();
		} else if (resp.status === 404) {
			console.log(`${name} Not found`);
			return { error: `${name} Not Found` };
		} else if (resp.status === 500) {
			console.log(`${name} API Server error`);
			return { error: `${name} API Server error` };
		} else {
			console.log(`${name} Unexpected status: ${resp.status}`);
			return { error: `${name} Unexpected error (${resp.status})` };
		}
	}

	async get(endpoint: string, name: string) {
		try {
			console.log(`Fetching ${name} from ${API_BASE_URL}${endpoint}`);
			const resp = await this.fetch(`${API_BASE_URL}${endpoint}`);
			return await this.checkStatus(resp, name);
		} catch (error) {
			console.error(`Failed to fetch ${name}:`, error);
			return { error: `Failed to load ${name}` };
		}
	}
}

// Convenience function to create API client
export function createApiClient(fetch: typeof globalThis.fetch) {
	return new ApiClient(fetch);
}
