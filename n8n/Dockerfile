FROM n8nio/n8n:latest

USER root

# Create a directory for custom extensions that won't be overwritten by volumes
RUN mkdir -p /home/node/custom-nodes

# Install the plugin into that directory
WORKDIR /home/node/custom-nodes
RUN npm install n8n-nodes-evolution-api --ignore-scripts

# Ensure permissions are correct
RUN chown -R node:node /home/node/custom-nodes

USER node