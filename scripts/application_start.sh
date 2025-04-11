cd /home/ubuntu/iwantit
pm2 delete all || true
pm2 start --time npm --name "iwantit" -- start
#pm2 start ecosystem.config.js