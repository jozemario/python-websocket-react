FROM node:22-slim AS build

LABEL authors="jozemario"

WORKDIR /app

#RUN apk add --no-cache \
#    libc6-compat \
#    git \
#    python3 \
#    make \
#    g++ \
#    bash \
#    curl \
#    wget

RUN apt-get update && apt-get install -y \
    git \
    python3 \
    make \
    g++ \
    bash \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate
#ENV NODE_TLS_REJECT_UNAUTHORIZED=0
# Copy package files and source files for all apps
COPY federation_consumer/package.json federation_consumer/pnpm-lock.yaml federation_consumer/yarn.lock /app/federation_consumer/
COPY federation_consumer/src /app/federation_consumer/src
COPY federation_consumer/eslint.config.mjs /app/federation_consumer/
COPY federation_consumer/tsconfig.json federation_consumer/rsbuild.config.ts /app/federation_consumer/

COPY federation_provider/package.json federation_provider/pnpm-lock.yaml federation_provider/yarn.lock /app/federation_provider/
COPY federation_provider/src /app/federation_provider/src
COPY federation_provider/eslint.config.mjs /app/federation_provider/
COPY federation_provider/tsconfig.json federation_provider/rsbuild.config.ts federation_provider/tailwind.config.js federation_provider/postcss.config.cjs /app/federation_provider/

COPY ui_provider/package.json ui_provider/pnpm-lock.yaml ui_provider/yarn.lock /app/ui_provider/
COPY ui_provider/src /app/ui_provider/src
COPY ui_provider/eslint.config.mjs /app/ui_provider/
COPY ui_provider/tsconfig.json ui_provider/rsbuild.config.ts ui_provider/tailwind.config.js ui_provider/postcss.config.cjs /app/ui_provider/

ENV DISABLE_OPENCOLLECTIVE=true
# Install dependencies and build all apps
#RUN pnpm add -g @rsbuild/core @rspack/cli

WORKDIR /app/ui_provider
RUN pnpm install
RUN pnpm run build
#RUN yarn install --ignore-engines
#RUN yarn run build

WORKDIR /app/federation_provider
RUN pnpm install
RUN pnpm run build
#RUN yarn install --ignore-engines
#RUN yarn run build

WORKDIR /app/federation_consumer
RUN pnpm install
RUN pnpm run build
#RUN yarn install --ignore-engines
#RUN yarn run build

FROM nginx:alpine AS runtime

ARG PORT=8001
ENV HTTP_PORT=$PORT

# Copy built files from each app
COPY --from=build /app/federation_consumer/dist/ /usr/share/nginx/html/federation_consumer/
COPY --from=build /app/federation_provider/dist/ /usr/share/nginx/html/federation_provider/
COPY --from=build /app/ui_provider/dist/ /usr/share/nginx/html/ui_provider/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN sed -i "s/\$HTTP_PORT/${HTTP_PORT}/g" /etc/nginx/conf.d/default.conf

EXPOSE $HTTP_PORT

CMD ["nginx", "-g", "daemon off;"]
