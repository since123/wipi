node -v
npm -v

npm config set registry http://registry.npmjs.org 

npm install pm2 -g
npm i -g @nestjs/cli

# docker run --restart=always --name wipi-mysql -p 33721:3306 -e MYSQL_ROOT_PASSWORD=root -d ec7e75e5260c


cd client
npm install
npm run build
pm2 start npm --name client -- start

cd ../

cd server
npm install
npm run build
pm2 start npm --name server -- run start:prod

cd ../

pm2 startup
pm2 save

