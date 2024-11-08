FROM node:22-bookworm AS node_base

RUN DEBIAN_FRONTEND=noninteractive apt-get update \
  && apt-get upgrade -qq \
  && apt-get install -qq make cmake g++ \
  && apt-get install -qq postgresql-client \
  && apt-get install -qq vim \
  && apt-get install -qq nano \
  && rm -rf /var/cache/apk/*

WORKDIR /home

RUN npm install npm@latest -g
RUN npm install pm2@latest -g

COPY . .

ENTRYPOINT [ "./entrypoint.sh" ]

CMD [ "pm2", "start", "pm2.config.cjs", "--no-daemon" ]
