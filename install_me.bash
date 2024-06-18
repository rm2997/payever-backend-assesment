#!/bin/bash

# # Update package lists
# echo "Updating package lists..."
# sudo apt-get update

# # Install Node.js and npm
# echo "Installing Node.js and npm..."
# sudo apt-get install -y nodejs npm

# # Install NestJS CLI
# echo "Installing NestJS CLI..."
# sudo npm install -g @nestjs/cli

# Install Docker if not installed
if ! [ -x "$(command -v docker)" ]; then
    echo "Installing Docker..."
    sudo apt-get install -y docker.io
fi

# Start Docker service
echo "Starting Docker service..."
sudo systemctl start docker

# Pull MongoDB image and run container
echo "Setting up MongoDB container..."
sudo docker pull mongo
sudo docker run --name mongodb -d mongo

# Pull RabbitMQ image and run container
echo "Setting up RabbitMQ container..."
sudo docker pull rabbitmq:3.7
docker run -d --hostname my-rabbit --name rabbitmqContainer rabbitmq:3.7

# Clone your project repository
echo "Cloning project repository..."
git clone https://github.com/rm2997/payever-backend-assesment.git

# Navigate to your project directory
cd payever-backend-assesment

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Start the application (optional)
echo "Starting the application..."
mkdir -p data/avatars
npm run start

echo "Environment setup complete."

