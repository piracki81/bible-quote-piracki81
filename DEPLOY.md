# Deploying Bible Quotes App to VPS with Docker

## Prerequisites

- A VPS server running Linux (Ubuntu/Debian recommended)
- SSH access to your server
- Domain name (optional, but recommended)

## Step 1: Install Docker and Docker Compose

SSH into your VPS and run:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Add your user to docker group (optional, allows running docker without sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect

# Verify installation
docker --version
docker compose version
```

## Step 2: Transfer Files to VPS

From your local machine, transfer the project files:

```bash
# Option A: Using scp
scp -r /path/to/your/project/* user@your-vps-ip:/home/user/bible-quotes/

# Option B: Using rsync (recommended)
rsync -avz --exclude 'node_modules' --exclude '.git' /path/to/your/project/ user@your-vps-ip:/home/user/bible-quotes/
```

## Step 3: Build and Run the Container

SSH into your VPS:

```bash
cd /home/user/bible-quotes

# Build and start the container
docker compose up -d --build
```

Your app will now be running at `http://your-vps-ip:3000`

## Step 4: (Optional) Set Up Reverse Proxy with SSL

### Install Nginx

```bash
sudo apt install nginx -y
```

### Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/bible-quotes
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;  # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/bible-quotes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Install SSL with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Certbot will automatically configure SSL
```

## Useful Docker Commands

```bash
# View running containers
docker ps

# View logs
docker logs bible-quotes-app

# Stop the container
docker compose down

# Restart the container
docker compose restart

# Rebuild and restart
docker compose up -d --build

# View resource usage
docker stats bible-quotes-app
```

## Updating the App

After making changes to your code:

```bash
# Transfer updated files to VPS
rsync -avz --exclude 'node_modules' --exclude '.git' /path/to/your/project/ user@your-vps-ip:/home/user/bible-quotes/

# SSH into VPS and rebuild
cd /home/user/bible-quotes
docker compose down
docker compose up -d --build
```

## Firewall Configuration (Optional)

If you're using UFW:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

## Troubleshooting

### Container won't start
```bash
# Check logs for errors
docker logs bible-quotes-app

# Verify Docker is running
sudo systemctl status docker
```

### Port already in use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Kill the process if needed
sudo kill -9 <PID>
```

### Nginx issues
```bash
# Test nginx configuration
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```
