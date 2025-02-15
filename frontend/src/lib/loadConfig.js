import fs from 'fs';
import path from 'path';
import toml from 'toml';
import os from 'os';

const CONFIG_PATH = path.join(os.homedir(), '.config/appgoblin/config.toml');

export default function loadConfig() {
	try {
		const configContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
		const parsedConfig = toml.parse(configContent);
		return parsedConfig.cloud?.adstxt_endpoint || null;
	} catch (error) {
		console.error('Failed to load config:', error);
		return null;
	}
}
