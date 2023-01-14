# soruce images
FROM node:lts

# envs
ENV NPM_VERSION=9.3.0

# Create a working directory
RUN mkdir -p /usr/src/app

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json /usr/src/app/

# update npm
RUN npm install -g npm@$NPM_VERSION

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . /usr/src/app

# If you are building your code for production
RUN npm run build

# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
RUN npm cache clean --force && \
    mkdir -p /.npm && \
    chown -R 15444:15444 /.npm 
USER node
# Expose the application's port
EXPOSE 3000

# Run the application
CMD [ "npm", "run", "start" ]