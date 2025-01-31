// src/routes/mypath/download/+server.ts
import type { RequestHandler } from '@sveltejs/kit';



async function getPublishersApps(companyDomain: string, publisher_id: string) {
    const publishers_apps = fetch(
        `http://localhost:8000/api/companies/${companyDomain}/adstxt/publisher/${publisher_id}/download`
    );
    return publishers_apps;
}


const generateCSV = (publishersApps: any[]) => {
    // Generate CSV using publishersApps data
    return publishersApps
        .map(app => [app.name, app.publisher, app.status].join(','))
        .join('\n');
};




export const GET: RequestHandler = async ( { params } ) => {
    const domain = params.domain || '';
    const publisher_id = params.publisher_id || '';

    const response  = await getPublishersApps(domain, publisher_id);

    // Create response with appropriate headers
    return new Response(response.body, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="adstxt_${domain}_${publisher_id}.csv"`
        }
    });
}

