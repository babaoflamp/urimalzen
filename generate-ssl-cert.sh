#!/bin/bash
# Generate self-signed SSL certificate for urimalzen

# Create directory for SSL certificates
sudo mkdir -p /etc/nginx/ssl

# Generate private key and certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/urimalzen.key \
  -out /etc/nginx/ssl/urimalzen.crt \
  -subj "/C=KR/ST=Seoul/L=Seoul/O=Urimalzen/OU=Development/CN=192.168.200.200"

# Set appropriate permissions
sudo chmod 600 /etc/nginx/ssl/urimalzen.key
sudo chmod 644 /etc/nginx/ssl/urimalzen.crt

echo "SSL certificate generated successfully!"
echo "Certificate: /etc/nginx/ssl/urimalzen.crt"
echo "Private key: /etc/nginx/ssl/urimalzen.key"
