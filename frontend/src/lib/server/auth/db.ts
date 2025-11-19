import { Pool, type PoolConfig, type QueryResult } from "pg";
import { env } from "$env/dynamic/private";

class Database {
	private pool: Pool;
	private isConnected = false;

	constructor() {
		const config: PoolConfig = {
			host: env.PGHOST || "localhost",
			port: parseInt(env.PGPORT || "5432"),
			database: env.PGDATABASE || "goblinadmin",
			user: env.PGUSER || "frontend",
			password: env.PGPASSWORD,
			max: 20, // maximum pool size
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
		};

		this.pool = new Pool(config);

		// Handle pool errors
		this.pool.on("error", (err) => {
			console.error("Unexpected database pool error:", err);
		});
	}

	async connect(): Promise<void> {
		if (this.isConnected) return;
		
		try {
			const client = await this.pool.connect();
			client.release();
			this.isConnected = true;
			console.log("Database connected successfully");
		} catch (error) {
			console.error("Failed to connect to database:", error);
			throw error;
		}
	}

	async queryOne<T = unknown>(
		sql: string,
		params: unknown[] = []
	): Promise<T | null> {
		try {
			const result = await this.pool.query(sql, params);
			return result.rows.length === 0 ? null : (result.rows[0] as T);
		} catch (error) {
			console.error("Query error:", error, { sql, params });
			throw error;
		}
	}

	async query<T = unknown>(
		sql: string,
		params: unknown[] = []
	): Promise<T[]> {
		try {
			const result = await this.pool.query(sql, params);
			return result.rows as T[];
		} catch (error) {
			console.error("Query error:", error, { sql, params });
			throw error;
		}
	}

	async execute(
		sql: string,
		params: unknown[] = []
	): Promise<{ changes: number }> {
		try {
			const result = await this.pool.query(sql, params);
			return {
				changes: result.rowCount || 0,
			};
		} catch (error) {
			console.error("Execute error:", error, { sql, params });
			throw error;
		}
	}

	async transaction<T>(
		callback: (client: Pool) => Promise<T>
	): Promise<T> {
		const client = await this.pool.connect();
		try {
			await client.query("BEGIN");
			const result = await callback(client as unknown as Pool);
			await client.query("COMMIT");
			return result;
		} catch (error) {
			await client.query("ROLLBACK");
			console.error("Transaction error:", error);
			throw error;
		} finally {
			client.release();
		}
	}

	async close(): Promise<void> {
		await this.pool.end();
		this.isConnected = false;
		console.log("Database pool closed");
	}
}

export const db = new Database();