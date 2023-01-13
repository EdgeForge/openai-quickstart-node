FROM node:16

# Create a working directory
RUN mkdir -p /usr/src/app

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json /usr/src/app/

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . /usr/src/app
# If you are building your code for production
RUN npm run build
# https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
RUN mkdir /.npm
RUN chown -R 15444:15444 /.npm
USER node
# Expose the application's port
EXPOSE 3000

# Run the application
CMD [ "npm", "run", "start" ]