import type { RequestHandler } from './$types';

const NO_CACHE_HEADERS = {
    'Cache-Control': 'no-store,no-cache,must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Content-Type': 'application/json'
};

export const GET: RequestHandler = async () => {
    const payload = {
        status: 'ok',
        service: 'frontend',
        timestamp_utc: new Date().toISOString()
    };

    return new Response(JSON.stringify(payload), {
        status: 200,
        headers: NO_CACHE_HEADERS
    });
};
