# Directly: Ultimate Deployment Guide (Oracle Cloud Free Tier)

This guide covers the 100% free, "Always On" deployment method using Oracle Cloud. It includes fixes for common bugs like "greyed out networking" and "out of capacity" errors.

---

## 1. Create your Network (The Manual Way)
*Oracle's "Create Instance" wizard often bugs out. Creating your network manually first is the only way to ensure your Public IP works.*

1. Log in to Oracle Cloud.
2. Click the **Hamburger Menu (≡)** -> **Networking** -> **Virtual cloud networks**.
3. Click **Start VCN Wizard**.
4. Select **VCN with Internet Connectivity** and click **Start VCN Wizard**.
5. Name it `DirectlyVCN` and click **Next** -> **Create**.
   - *This creates your Public Subnet and Internet Gateway automatically.*

---

## 2. Create your Server (The "Instance")
1. Go to **Compute** -> **Instances** -> **Create Instance**.
2. **Placement:** Click **Edit**. Try **AD-1**, **AD-2**, or **AD-3**. 
   - *Note: If one AD says "Out of capacity," try the next one. These 24GB servers are very popular!*
3. **Image and Shape:** Click **Edit**.
   - **Image:** Click **Change Image** and select **Ubuntu 24.04**.
   - **Shape:** Click **Change Shape**. Select **Ampere** -> **VM.Standard.A1.Flex**.
   - **Specs:** Slide OCPU to **4** and Memory to **24 GB**.
4. **Networking:**
   - Select **Select existing virtual cloud network** -> `DirectlyVCN`.
   - Select **Select existing subnet** -> `Public Subnet-DirectlyVCN`.
   - Ensure **Assign a public IPv4 address** is **ON**.
5. **SSH Keys:** Click **Save private key** and download the file. **Do not lose this!**
6. **Storage:** Toggle **Specify a custom boot volume size** and set it to **100 GB**.
7. Click **Create**.

---

# 3. Configure the Server Environment
Once the instance status is "Running," copy the **Public IP Address** (e.g., `130.162.57.229`). Open your Mac terminal and connect:

```bash
# 1. Set permissions for your key (do this once)
# Example using your current key:
chmod 400 ~/Documents/keys/ssh-key-2026-04-23.key

# 2. Connect to the server
# Example using your current key and IP:
ssh -i ~/Documents/keys/ssh-key-2026-04-23.key ubuntu@130.162.57.229
```

Inside the server, run these setup commands:
```bash
# 1. Update system
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install Node.js 20 & Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# 3. Install PM2 (Process Manager)
sudo npm install -g pm2
```

---
## 4. Deploy the Code
```bash
# Setup directory structure
mkdir -p ~/directly-app/releases
cd ~/directly-app

# Clone the repository for the first time
git clone https://github.com/your-username/directly-app.git current

# Transfer your .env and dev.db from your LOCAL Mac to the server
# (Run this on your Mac terminal, not the server)
# NOTE: The .env should live in the parent directory ~/directly-app/
# Example using your current key and IP:
scp -i ~/Documents/keys/ssh-key-2026-04-23.key .env ubuntu@130.162.57.229:~/directly-app/.env
scp -i ~/Documents/keys/ssh-key-2026-04-23.key prisma/dev.db ubuntu@130.162.57.229:~/directly-app/current/prisma/dev.db

# Build and Launch (on the server)
cd ~/directly-app/current
ln -sfn ../.env .env
npm install
npx prisma generate
npm run build
pm2 start npm --name "directly" -- run start
pm2 save
pm2 startup
```

### Atomic Symlink Deploys
The project now uses an **Atomic Symlink Deployment** strategy.
- **`~/directly-app/.env`**: The shared environment file.
- **`~/directly-app/releases/`**: Stores timestamped or SHA-named build folders.
- **`~/directly-app/current`**: A symlink that always points to the active release.

This ensures zero-downtime during `npm install` and allows for instant rollbacks.

#### Manual Update
To perform a manual update on the server:
```bash
./scripts/update.sh
```

#### Instant Rollback
If a deployment fails or introduces a critical bug, roll back instantly:
```bash
# Roll back to the previous release
./scripts/rollback.sh

# Or roll back to a specific release folder
./scripts/rollback.sh 20231027123000
```

---

## 5. Automation (Zero-Touch Updates)
I've already added a `.github/workflows/deploy.yml` and `scripts/update.sh` to your project. 

1. Go to your GitHub Repo -> **Settings** -> **Secrets** -> **Actions**.
2. Add these three secrets:
   - `VPS_HOST`: Your Server IP.
   - `VPS_USERNAME`: `ubuntu`
   - `VPS_SSH_KEY`: The contents of your `.key` file.

**Now, whenever you run `git push origin main`, your server will update itself automatically!**

---

## Troubleshooting "Out of Capacity"
If AD-1, AD-2, and AD-3 all say "Out of capacity," you have two choices:
- **Wait and Retry:** Spots open up constantly as people delete instances.
- **Downgrade:** Switch the Shape to **AMD `VM.Standard.E2.1.Micro`** (1GB RAM). If you do this, you **MUST** run this command on the server to prevent crashes:
  ```bash
  sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
  ```
