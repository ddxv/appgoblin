"""Main start point for LiteStar API."""

import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from litestar import Litestar, Request
from litestar.config.cors import CORSConfig
from litestar.logging import LoggingConfig
from litestar.openapi import OpenAPIConfig, OpenAPIController

from api_app.controllers.apps import AppController
from api_app.controllers.categories import CategoryController
from api_app.controllers.companies import CompaniesController
from api_app.controllers.creatives import CreativesController
from api_app.controllers.developers import DeveloperController
from api_app.controllers.keywords import KeywordsController
from api_app.controllers.rankings import RankingsController
from api_app.controllers.scry import ScryController
from api_app.controllers.sdks import SdksController
from dbcon.connections import get_db_connection
from dbcon.static import load_static_data

logger = logging.getLogger(__name__)


cors_config = CORSConfig(
    allow_origins=[
        "localhost",
        "scry.appgoblin.info",
    ],
)


class MyOpenAPIController(OpenAPIController):
    """Set Path for API docs."""

    path = "/api/docs"


logging_config = LoggingConfig(
    root={"level": logging.getLevelName(logging.INFO), "handlers": ["console"]},
    formatters={
        "standard": {"format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"},
    },
)


def restrict_access(request: Request, route_handler) -> None:
    """Guard to restrict access.

    - ScryController endpoints are always public
    - Other endpoints are open to localhost, but require an API key otherwise

    """
    if route_handler.owner.__class__ == ScryController:
        return

    # Check if the request is from localhost
    client_host = request.client.host if request.client else None
    is_localhost = client_host in ("127.0.0.1", "localhost")

    if is_localhost:
        return


# Apply the guard to specific controllers
private_controllers = [
    AppController,
    DeveloperController,
    CategoryController,
    RankingsController,
    CompaniesController,
    SdksController,
    CreativesController,
]

# Set the guard on private controllers
for controller in private_controllers:
    controller.guards = [restrict_access]


@asynccontextmanager
async def db_lifespan(app: Litestar) -> AsyncGenerator[None]:
    """Manage database connections for the application lifespan.

    This context manager:
    1. Creates database connections on startup
    2. Stores them in app.state for access throughout the app
    3. Ensures proper cleanup on shutdown, even if errors occur
    """
    logger.info("Starting database connections...")

    # Initialize connections
    try:
        app.state.dbcon = get_db_connection(server_name="madrone")
        logger.info("Connected to madrone (read)")

        # Preload all static data
        logger.info("Preloading static data...")
        app.state.static_data = load_static_data(app.state.dbcon.engine)
        logger.info("Static data preloading complete")

        try:
            app.state.dbconwrite = get_db_connection(server_name="madrone-write")
            logger.info("Connected to madrone-write")
        except Exception:
            logger.exception("Failed to connect to madrone-write, will use read-only")
            app.state.dbconwrite = None
    except Exception:
        logger.exception("Failed to initialize database connections")
        raise

    try:
        # Application runs here
        yield
    finally:
        # Cleanup - always runs, even if there's an error
        logger.info("Closing database connections...")

        if hasattr(app.state, "dbcon") and app.state.dbcon:
            try:
                app.state.dbcon.engine.dispose()
                logger.info("Disposed madrone connection")
            except Exception:
                logger.exception("Error disposing madrone connection")

        if hasattr(app.state, "dbconwrite") and app.state.dbconwrite:
            try:
                app.state.dbconwrite.engine.dispose()
                logger.info("Disposed madrone-write connection")
            except Exception:
                logger.exception("Error disposing madrone-write connection")


app = Litestar(
    route_handlers=[
        AppController,
        DeveloperController,
        CategoryController,
        RankingsController,
        CompaniesController,
        SdksController,
        KeywordsController,
        ScryController,
        CreativesController,
    ],
    cors_config=cors_config,
    openapi_config=OpenAPIConfig(
        title="App Store API",
        version="0.0.1",
        openapi_controller=MyOpenAPIController,
    ),
    lifespan=[db_lifespan],
    logging_config=logging_config,
    debug=True,
)
