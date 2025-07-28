import logging
import time
from pythonjsonlogger import jsonlogger

# Setup logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# JSON formatter
formatter = jsonlogger.JsonFormatter('%(asctime)s %(levelname)s %(message)s')

# 1. Console Handler (stdout - visible with docker-compose logs)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

# 2. File Handler (inside container - saved to mounted volume)
file_handler = logging.FileHandler("./logs/app.log")  # this path must exist
file_handler.setLevel(logging.INFO)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

print("Handlers:", logger.handlers)

"""
To write the logs to a file, this seems to be the easiest way
(because writing from the logging app doesn't seem to work):

docker logs -f dietbot_app > ./logs/output.log

-----
Bonus: Automatically Save Logs from a Background Container
If your container runs in detached mode (-d), you can still save logs like this:

docker logs dietbot_app > ./logs/saved_logs.txt
"""