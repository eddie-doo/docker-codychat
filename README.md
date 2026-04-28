# docker-codychat
A containerized Codychat 10.1 with security hardening baked into the image. Designed for easily deploying/testing custom builds, and reducing hosting operation costs.

# Features & Stack Decisions

*Containerization*
- Isolated services (Apache/PHP and MariaDB run in separate containers on a private Docker network)
- Layer-optimized Dockerfile - depencency installation is ordered to maximize Docker cache reuse; source code changes don't trigger apt or extension rebuilds
- Sensitive values (e.g Codychat license key and database credentials) are passed using Docker secrets and are never written to any image layer

*PHP 8.4 / Apache*
- Extensions compiled in: pdo_mysql, mysqli, zip, gd, mbstring, redis
- Apache comes with preconfigured mod_rewrite, mod_security2, and mod_headers rules for security hardening
- Ioncube is pre-loaded and the image runs installer.php on build

## Project Structure
 
```
├── docker/
│   ├── php/
│   │   ├── Dockerfile              # Apache + PHP 8.4 image definition
│   │   ├── php.ini                 # Custom PHP configuration
│   │   └── modsecurity/
│   │       └── modsecurity.conf    # ModSecurity WAF rules and config
├── src/                            # Base Codychat 10.1 source
├── docker-compose.yml              # Service orchestration
├── .env.example                    # Checked-in template for required env vars
└── README.md
```
