curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

node -v
npm -v

npm config set registry http://registry.npmjs.org 

npm install pm2 -g

cd client
npm install --production
npm run build
pm2 start npm --name client -- start

cd ../

cd server
npm install --production
npm run build
pm2 start npm --name server -- start:prod

pm2 startup
pm2 save
