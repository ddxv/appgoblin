const API_BASE_URL = 'http://localhost:8000/api';
import { error } from '@sveltejs/kit';

export class ApiClient {
	constructor(private fetch: typeof globalThis.fetch) {}

	private async checkStatus(resp: Response, name: string) {
		if (resp.status === 200) {
			return resp.json();
		} else if (resp.status === 404) {
			console.log(`${name} API: ${resp.status}`);
			return { status: 404, error: `${name} Not Found` }; //
		} else if (resp.status === 500) {
			console.log(`${name} API Server error: ${resp.status}`);
			return { status: 500, error: `${name} API Server error` };
		} else {
			console.log(`${name} Unexpected status: ${resp.status}`);
			return { status: resp.status, error: `${name} Unexpected error (${resp.status})` };
		}
	}

	async get(endpoint: string, name: string) {
		console.log(`Fetching ${name} from ${API_BASE_URL}${endpoint}`);
		const resp = await this.fetch(`${API_BASE_URL}${endpoint}`);
		const checkedResp = await this.checkStatus(resp, name);
		if (checkedResp.error) {
			throw error(checkedResp.status, checkedResp.error);
		}
		return checkedResp;
	}
}

export function createApiClient(fetch: typeof globalThis.fetch) {
	return new ApiClient(fetch);
}
