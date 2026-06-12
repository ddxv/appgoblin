"""Shared serialisation helpers for MCP tool responses.

All public response models in ``controllers/public/v1/public_models.py`` are
standard ``@dataclass`` types, not Pydantic models, so they do not carry
``model_dump_json()``.  This module provides a consistent ``to_json()`` helper
that the tool modules use instead.
"""

from __future__ import annotations

import dataclasses
import json
from collections.abc import Callable
from typing import Any


def to_json(
    obj: Any, *, indent: int | None = 2, default: Callable[[Any], Any] | None = None
) -> str:
    """Serialize a dataclass (or list of dataclasses) to a JSON string.

    Parameters
    ----------
    obj
        A dataclass instance, a list/tuple of dataclass instances, or any value
        that ``json.dumps`` can handle directly.
    indent
        Pretty-print indent level (``None`` for compact output).
    default
        Optional custom serializer for non-serializable values.  When omitted
        ``str()`` is used as a fallback.

    """
    if dataclasses.is_dataclass(obj) and not isinstance(obj, type):
        obj = dataclasses.asdict(obj)
    elif isinstance(obj, (list, tuple)) and all(
        dataclasses.is_dataclass(o) and not isinstance(o, type) for o in obj
    ):
        obj = [dataclasses.asdict(o) for o in obj]

    return json.dumps(obj, indent=indent, default=default or str)
