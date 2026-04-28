FROM php:8.4-apache

# -- System Dependencies -- #
# libapache2-mod-security2 is ModSecurity for Apache.
RUN apt-get update && apt-get install -y \
	libapache2-mod-security2 \
	libzip-dev \
	libpng-dev \
	libonig-dev \
	&& rm -rf /var/lib/apt/lists/* # Cleans up apt cache to keep image small

# -- PHP Extensions -- #
RUN docker-php-ext-install \
	pdo_mysql \
	mysqli \
	zip \
	gd \
	mbstring \
	redis \

# -- Apache Modules -- #
# mod_rewrite is needed for pretty URLs (.htaccess rewrites)
# mod_security2 is the WAF. mod_headers allows us to set security headers.
RUN a2enmod rewrite security2 headers

## -- Custom PHP Config -- ##
# Anything in /usr/local/etc/php/conf.d/ gets auto-loaded by PHP.
COPY php.ini /usr/local/etc/php/conf.d/custom.ini

# ModSecurity
COPY modsecurity/modsecurity.conf /etc/modsecurity/modsecurity.conf

# Codychat
COPY ../src/ /var/www/html

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

