# AppGoblin Free App Analytics & SDK Analysis

[AppGoblin is a site for free app marketing aso tools, iOS and Android SDK analysis and ad tech company analysis for over 4 million apps](https://appgoblin.info).  This repo is the frontend and backend of [AppGoblin](https://appgoblin.info) website itself. The data is crawled by [ddxv/adscrawler](https://github.com/ddxv/adscrawler).

[<img src="/frontend/static/appgoblin_screenshot.png" width="500"/>](/frontend/static/appgoblin_screenshot.png)


## AppGoblin Features

- **[App Intelligence](https://appgoblin.info/)**: AppGoblin has data on over 4 million iOS and Android apps with more added daily.
  - Keywords: Track your or competitors' keywords and the top apps associated with those keywords
  - Trends: Track installs or ratings over time
  - SDKs: See which third party SDK and frameworks apps use
- **[Companies Directory](https://appgoblin.info/companies)**: Rankings based on SDK integration frequency
  - Filter by category
    - Example: [Most popular Ad Networks for Casino Games](https://appgoblin.info/companies/types/ad-networks/game_casino)
    - Example: [Most popular Product analytics for Business Apps](https://appgoblin.info/companies/types/product-analytics/business)
- **Company Intelligence**: See the top client apps for mobile app companies
  - Example: [Salesforce Clients](https://appgoblin.info/companies/salesforce.com)
  - Example: [AppsFlyer Top Apps](https://appgoblin.info/companies/appsflyer.com)
- **[App Rankings](https://appgoblin.info/rankings/store/1/collection/1/category/1/US)**: Daily tracking of top apps from Google Play and Apple App Store.
- **[SDK Analysis](https://appgoblin.info/sdks)**: Detailed list of decompiled Android and iOS Apps and their internally used SDKs. See what tracking SDKs are used in which apps.

### Project Structure

1.  Python Litestar backend API found in `backend/`
2.  Javascript SvelteKit+Tailwind UI found in `frontend/`


### Setup

- Current setup is based on Python3.12
- pip install dependencies, found in pyproject.toml: `pip install`

### Running

- To run locally for testing use
  - Backend: in `backend/` run `gunicorn -k uvicorn.workers.UvicornWorker app:app` or `litestar run dev`
  - Frontend: in `frontend` run `npm run dev`
- This repo includes the scripts used to run in production as well. These are located in the steps in `.github/actions` as well as `scripts` for systemd services for frontend and backend.
- Additionally, you will need a proxy. I used Nginx. This is wherever you have your nginx configuration set, possibly sites-available `/etc/nginx/sites-available/appgoblin-api` or `/etc/nginx/conf.d/appgoblin-api.conf`

## AppGoblin Community

**Have questions or suggestions? Let's connect!**

🧙‍♂️ [Join Discord Server](https://discord.gg/7jpWEhkXRW)
