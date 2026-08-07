from functools import wraps


def tool_error_handler(func):
    """
    Decorator for handling tool errors gracefully.
    """

    @wraps(func)
    def wrapper(*args, **kwargs):

        try:
            return func(*args, **kwargs)

        except Exception as e:

            return {
                "status": "error",
                "tool": func.__name__,
                "message": str(e)
            }

    return wrapper