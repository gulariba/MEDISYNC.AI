from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import time
import uuid
from ..utils.logging_config import get_logger

logger = get_logger(__name__)

async def error_handler_middleware(request: Request, call_next):
    """
    Global error handling middleware
    Catches all exceptions and returns structured error responses
    """
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        logger.error(f"Request {request_id} failed: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal Server Error",
                "message": str(exc),
                "request_id": request_id
            }
        )

async def request_logging_middleware(request: Request, call_next):
    """
    Request logging middleware
    Logs all incoming requests and response times
    """
    start_time = time.time()
    request_id = getattr(request.state, 'request_id', str(uuid.uuid4()))

    logger.info(f"Request {request_id}: {request.method} {request.url.path}")

    response = await call_next(request)

    process_time = time.time() - start_time
    logger.info(
        f"Request {request_id} completed in {process_time:.4f}s "
        f"with status {response.status_code}"
    )

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = str(process_time)

    return response

def setup_exception_handlers(app):
    """
    Set up custom exception handlers for the application
    """

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        request_id = getattr(request.state, 'request_id', 'unknown')
        logger.warning(
            f"HTTP exception for request {request_id}: "
            f"{exc.status_code} - {exc.detail}"
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.detail,
                "status_code": exc.status_code,
                "request_id": request_id
            }
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        request_id = getattr(request.state, 'request_id', 'unknown')
        logger.warning(f"Validation error for request {request_id}: {exc.errors()}")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": "Validation Error",
                "details": exc.errors(),
                "request_id": request_id
            }
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        request_id = getattr(request.state, 'request_id', 'unknown')
        logger.error(
            f"Unhandled exception for request {request_id}: {str(exc)}",
            exc_info=True
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal Server Error",
                "message": "An unexpected error occurred",
                "request_id": request_id
            }
        )
