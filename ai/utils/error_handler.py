from functools import wraps


def tool_error_handler(func):
    """
    DEPRECATED: This decorator previously wrapped LangChain @tool functions but
    broke schema extraction because @tool needs the raw function signature.

    Tools now handle errors inline with try/except blocks.
    This decorator is kept as a no-op passthrough for backward compatibility
    in case it's imported elsewhere.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)

    return wrapper