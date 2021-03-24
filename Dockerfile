#
# Copyright (c) 2021 Her Majesty the Queen in Right of Canada, as represented by the Employment and Social Development Canada
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.
#

# Dockerfile

# base image
FROM node:lts-alpine

# install git - required by getGitCommit in misc-utils
RUN apk add --no-cache git

# create & set working directory
RUN mkdir -p /usr/app
WORKDIR /usr/app

# copy source files
COPY . /usr/app

# install dependencies
RUN yarn

# expose port
EXPOSE 3000

# start app with start:docker
CMD ["npm", "run", "start:docker"]