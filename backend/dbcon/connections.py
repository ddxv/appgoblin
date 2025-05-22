"""Create SQLAlchemy database connection engine."""

from socket import gethostbyname

import sqlalchemy

from config import CONFIG, get_logger

logger = get_logger(__name__)


def get_host_ip(hostname: str) -> str:
    """Convert hostname to IPv4 address if needed."""
    # Check if hostname is already an IPv4 address
    if all(part.isdigit() and 0 <= int(part) <= 255 for part in hostname.split(".")):  # noqa: PLR2004
        return hostname
    ip_address = gethostbyname(hostname)
    logger.info(f"Resolved {hostname} to {ip_address}")
    return ip_address


def open_ssh_tunnel(server_name: str):  # noqa: ANN201
    """Create SSH tunnel when working remotely."""
    from sshtunnel import SSHTunnelForwarder

    ssh_host = get_host_ip(CONFIG[server_name]["host"])

    ssh_port = CONFIG[server_name].get("ssh_port", 22)

    with SSHTunnelForwarder(
        (ssh_host, ssh_port),  # Remote server IP and SSH port
        ssh_username=CONFIG[server_name]["os_user"],
        ssh_pkey=CONFIG[server_name].get("ssh_pkey", None),
        ssh_private_key_password=CONFIG[server_name].get("ssh_pkey_password", None),
        remote_bind_address=("127.0.0.1", 5432),
    ) as server:  # PostgreSQL server IP and sever port on remote machine
        logger.info(f"Opened SSH Tunnel {server_name=}")
    return server


class PostgresCon:
    """Class for managing the connection to PostgreSQL."""

    def __init__(
        self, config_name: str, db_ip: str, db_port: str, tag: str = "prod"
    ) -> None:
        """Initialize the PostgreSQL connection.

        Args:
            config_name (str): Corresponds to the server title in the config file.
            db_ip (str): IP address of the database server.
            db_port (str): Port number of the database server.
            tag (str): Tag for the application name.

        """
        self.config_name = config_name
        self.db_name = CONFIG[config_name]["db_name"]
        self.db_ip = db_ip
        self.db_port = db_port
        self.tag = tag
        self.engine: sqlalchemy.Engine

        try:
            self.db_pass = CONFIG[self.config_name]["db_password"]
            self.db_user = CONFIG[self.config_name]["db_user"]
        except KeyError:
            logger.exception(f"Loading db_auth for {self.config_name}")
            raise

    def set_engine(self) -> None:
        """Set up the SQLAlchemy engine."""
        try:
            db_login = f"postgresql://{self.db_user}:{self.db_pass}"
            db_uri = f"{db_login}@{self.db_ip}:{self.db_port}/{self.db_name}"
            logger.info(f"AppGoblin connecting to PostgreSQL {self.db_name}")
            application_name = f"appgoblin-{self.tag}"
            self.engine = sqlalchemy.create_engine(
                db_uri,
                connect_args={
                    "connect_timeout": 30,
                    "application_name": application_name,
                    "pool_pre_ping": True,
                    "pool_recycle": 3600,
                },
            )
        except Exception:
            logger.exception(
                f"Failed to connect {self.db_name} @ {self.db_ip}",
            )
            raise


def get_db_connection(server_config_name: str) -> PostgresCon:
    """Return PostgresCon class.

    to use class run server.set_engine()

    ====
    Parameters
       server_name: str String of server name for parsing config file
    """
    server_ip, server_local_port, is_tunnel = get_postgres_server_ips(
        server_config_name
    )
    tag = "tunnel" if is_tunnel else "local"
    postgres_con = PostgresCon(server_config_name, server_ip, server_local_port, tag)
    return postgres_con


def get_postgres_server_ips(server_name: str) -> tuple[str, str, bool]:
    """Decide whether postgres is local or over ssh."""
    db_ip = CONFIG[server_name]["host"]
    if db_ip == "localhost" or db_ip.startswith("192.168.0"):
        db_ip = CONFIG[server_name]["host"]
        db_port = str(5432)
        is_tunnel = False
    else:
        logger.info(f"Opening SSH tunnel to {db_ip=} {server_name=}")
        ssh_server = open_ssh_tunnel(server_name)
        ssh_server.start()
        db_port = str(ssh_server.local_bind_port)
        db_ip = "127.0.0.1"
        is_tunnel = True
    logger.info(f"DB connection settings: {db_ip=} {db_port=}")
    return db_ip, db_port, is_tunnel
