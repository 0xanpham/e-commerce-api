# Variables
IMAGE_NAME=e-commerce-api
CONTAINER_NAME=e-commerce-api-container
PORT=8000
ENV_FILE=.env

# Default target
all: build

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME) .

# Run the container
run:
	docker run --name $(CONTAINER_NAME) --env-file $(ENV_FILE) -p $(PORT):$(PORT) $(IMAGE_NAME)

# Stop the container
stop:
	docker stop $(CONTAINER_NAME)

# Remove the container
clean:
	docker rm -f $(CONTAINER_NAME)

# Remove the image
clean-image:
	docker rm -f $(CONTAINER_NAME)
	docker rmi -f $(IMAGE_NAME)

# Restart the container
restart: stop clean run
