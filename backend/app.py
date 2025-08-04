"""Main start point for LiteStar API."""

import logging

from litestar import Litestar, Request
from litestar.config.cors import CORSConfig
from litestar.logging import LoggingConfig
from litestar.openapi import OpenAPIConfig, OpenAPIController

from api_app.controllers.apps import AppController
from api_app.controllers.categories import CategoryController
from api_app.controllers.companies import CompaniesController
from api_app.controllers.developers import DeveloperController
from api_app.controllers.keywords import KeywordsController
from api_app.controllers.rankings import RankingsController
from api_app.controllers.scry import ScryController
from api_app.controllers.sdks import SdksController
from api_app.controllers.creatives import CreativesController

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
    logging_config=logging_config,
    debug=True,
)
