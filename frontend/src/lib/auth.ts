import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { env } from '$env/dynamic/private';



const pool = new Pool({
  user: 'frontend',
  password: env.PGPASSWORD,
  host: 'localhost',
  port: 5433,
  database: 'agadmin',
})
 
console.log(await pool.query('SELECT NOW()'))


export const auth = betterAuth({
	database: pool,
	emailAndPassword: { 
		enabled: true, 
	  }, 
	  socialProviders: { 
		github: { 
		  clientId: env.GITHUB_CLIENT_ID as string, 
		  clientSecret: env.GITHUB_CLIENT_SECRET as string, 
		}, 
	  }, 
});
