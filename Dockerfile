FROM php:8.4-apache

# -- System Dependencies -- #
# All apt installs in one layer: cleans cache once, avoids stale index issues
# across split RUN blocks.
RUN apt-get update && apt-get install -y \
    libapache2-mod-security2 \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libicu-dev \
    ffmpeg \
    redis-server \                  
    && rm -rf /var/lib/apt/lists/*

# -- PHP Extensions (bundled) -- #
# These are compiled from source by docker-php-ext-install.
RUN docker-php-ext-install \
    pdo_mysql \
    mysqli \
    zip \
    gd \
    mbstring

# -- PHP Extensions (PECL) -- #
# redis is distributed via PECL, not bundled with PHP.
# docker-php-ext-enable writes the ini file that loads the .so.
RUN pecl install redis \
    && docker-php-ext-enable redis

# -- IonCube -- #
# IonCube ships as a prebuilt .so, -  so we copy it directly
# into PHP's extension directory and register it as a Zend extension in php.ini.
# It must be a zend_extension (not a regular extension) and must load
# before any IonCube-encoded files are touched.
COPY docker/ioncube/ioncube_loader_lin_8.4.so /usr/local/lib/php/extensions/ioncube_loader_lin_8.4.so

# -- Apache Modules -- #
RUN a2enmod rewrite security2 headers

# -- Custom PHP Config -- #
# Anything in /usr/local/etc/php/conf.d/ gets auto-loaded by PHP.
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# -- ModSecurity -- #
COPY docker/modsecurity/modsecurity.conf /etc/modsecurity/modsecurity.conf

# -- App Source -- #
COPY src/ /var/www/html/
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
