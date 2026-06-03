#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# CrackGate VPS bootstrap — run ONCE on a fresh Contabo (Ubuntu 22.04)
# as root, e.g.:
#     ssh root@<vps-ip>
#     curl -fsSL https://raw.githubusercontent.com/ydvikasiitkgp-arch/crackgate/main/scripts/vps-bootstrap.sh | bash
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

DEPLOY_USER="${DEPLOY_USER:-deploy}"
SSH_PUBKEY="${SSH_PUBKEY:-}"   # paste your public key when running interactively

log() { printf "\n\033[1;36m▶ %s\033[0m\n" "$*"; }

# ── 1. Base packages ────────────────────────────────────────────
log "Updating apt + installing base packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y \
  ca-certificates curl gnupg lsb-release \
  ufw fail2ban unattended-upgrades \
  htop git jq rsync tzdata

timedatectl set-timezone Asia/Kolkata

# ── 2. Docker Engine + Compose plugin ───────────────────────────
if ! command -v docker >/dev/null; then
  log "Installing Docker"
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
    https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
fi

# ── 3. Deploy user ──────────────────────────────────────────────
if ! id "$DEPLOY_USER" &>/dev/null; then
  log "Creating user '$DEPLOY_USER'"
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
  usermod -aG docker,sudo "$DEPLOY_USER"
  echo "$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl, /usr/bin/docker, /usr/bin/apt-get" \
    > "/etc/sudoers.d/$DEPLOY_USER"
fi

if [[ -n "$SSH_PUBKEY" ]]; then
  log "Installing SSH key for $DEPLOY_USER"
  install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
  echo "$SSH_PUBKEY" > "/home/$DEPLOY_USER/.ssh/authorized_keys"
  chown "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh/authorized_keys"
  chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"
fi

# ── 4. SSH hardening (only if deploy user has a working key — avoid lockout) ──
AUTH_KEYS="/home/$DEPLOY_USER/.ssh/authorized_keys"
if [[ -s "$AUTH_KEYS" ]] && grep -qE '^(ssh-(rsa|ed25519|ecdsa)|ecdsa-sha2)' "$AUTH_KEYS"; then
  log "Hardening SSH (disable root + password login)"
  sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/'           /etc/ssh/sshd_config
  sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
  sed -i 's/^#\?PubkeyAuthentication.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config
  systemctl restart ssh || systemctl restart sshd
else
  echo "⚠️  SKIPPING SSH hardening — no authorized_keys for '$DEPLOY_USER'."
  echo "    Re-run with SSH_PUBKEY=\"<your-public-key>\" to harden, or install"
  echo "    a key into $AUTH_KEYS and re-run this script."
fi

# ── 5. Firewall ────────────────────────────────────────────────
log "Configuring UFW"
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp     comment 'SSH'
ufw allow 80/tcp     comment 'HTTP'
ufw allow 443/tcp    comment 'HTTPS'
ufw --force enable

# ── 6. fail2ban + auto-updates ─────────────────────────────────
log "Enabling fail2ban + unattended-upgrades"
systemctl enable --now fail2ban
dpkg-reconfigure -f noninteractive unattended-upgrades

# ── 7. Swap (2 GB) — cheap safety for Next.js builds on 8 GB RAM ────
if [[ ! -f /swapfile ]]; then
  log "Creating 2 GB swapfile"
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl vm.swappiness=10 >/dev/null
  grep -q '^vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=10' >> /etc/sysctl.conf
fi

# ── 8. App directory ───────────────────────────────────────────
APP_DIR="/home/$DEPLOY_USER/crackgate"
if [[ ! -d "$APP_DIR" ]]; then
  log "Cloning repo into $APP_DIR (read-only HTTPS)"
  sudo -u "$DEPLOY_USER" git clone https://github.com/ydvikasiitkgp-arch/crackgate.git "$APP_DIR"
fi

cat <<EOF

✅ Bootstrap complete.

Next steps:
  1. ssh ${DEPLOY_USER}@<vps-ip>
  2. cd ~/crackgate
  3. cp .env.production.example .env.production && nano .env.production
  4. ./scripts/deploy.sh

EOF
