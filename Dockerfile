FROM node:14

WORKDIR /myfolder/
COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/
RUN yarn install

COPY . /myfolder/

#RUN node index.js 
#여러번 
CMD yarn start:dev
#한번 입력 