cd client
npm install
npm run build
pm2 start npm --name client -- start

cd ../

cd server
npm install
npm run build
pm2 start npm --name server -- run start:prod

pm2 startup
pm2 save