FROM node:20

# RUN apt-get update && apt-get install -y curl
# RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
# RUN apt-get install -y nodejs npm
COPY package* ./client/
COPY .npmrc ./client/

WORKDIR /client
RUN npm ci
WORKDIR ..

COPY . ./client/

WORKDIR /client
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
