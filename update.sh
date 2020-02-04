cd client
rm -rf .next
rm -rf node_modules
npm install
npm run build
pm2 start npm --name client -- start

cd ../

cd server
npm install
npm run build
pm2 start npm --name server -- run start:prod
