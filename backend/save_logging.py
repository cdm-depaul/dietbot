import logging

# Create logger
logger = logging.getLogger("my_app")
logger.setLevel(logging.DEBUG)  # Log everything, filter per handler

# Console handler (prints everything)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)  # Show all logs in console
console_formatter = logging.Formatter('[%(levelname)s] %(message)s')
console_handler.setFormatter(console_formatter)

# File handler (only ERROR and above)
file_handler = logging.FileHandler('/logs/error.log')  # use a mounted volume here in Docker
file_handler.setLevel(logging.ERROR)
file_formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(message)s')
file_handler.setFormatter(file_formatter)

# Add handlers
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# Sample logs
logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
logger.critical("Critical error")
