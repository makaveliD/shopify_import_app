FROM php:7.4-fpm

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    curl \
    libz-dev \
    libjpeg-dev libpng-dev libfreetype6-dev \
    libssl-dev libpcre3 libpcre3-dev \
    libmagickwand-dev imagemagick \
    wget

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php
RUN mv composer.phar /usr/local/bin/composer


# Install memcache extension
#RUN set -x \
#    && cd /tmp \
#    && curl -sSL -o php7.zip https://github.com/websupport-sk/pecl-memcache/archive/php7.zip \
#    && unzip php7 \
#    && cd pecl-memcache-php7 \
#    && /usr/local/bin/phpize \
#    && ./configure --with-php-config=/usr/local/bin/php-config \
#    && make \
#    && make install \
#    && echo "extension=memcache.so" > /usr/local/etc/php/conf.d/ext-memcache.ini \
#    && rm -rf /tmp/pecl-memcache-php7 php7.zip

# Install ImageMagick
RUN pecl install imagick
RUN docker-php-ext-enable \
    imagick

# Install redis php-exts
#RUN pecl install redis
#RUN docker-php-ext-enable \
#    redis

# Configure GD library
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Enable some php-exts
RUN docker-php-ext-install \
#    pdo_pgsql \
#    exif \
#    iconv \
#    mbstring \
     mysqli \
#    phar \
#    posix \
#    soap \
#    tokenizer \
    gettext \
    pdo_mysql \
    gd

RUN apt-get install -y \
        libzip-dev \
        zip \
  && docker-php-ext-install zip
# Install mailhog/mhsendmail
RUN wget https://github.com/mailhog/mhsendmail/releases/download/v0.2.0/mhsendmail_linux_amd64
RUN chmod +x mhsendmail_linux_amd64
RUN mv mhsendmail_linux_amd64 /usr/local/bin/mhsendmail

# Set the locale
RUN apt-get -qq update && apt-get -qqy install locales
RUN sed -i -e 's/# ru_RU ISO-8859-5/ru_RU ISO-8859-5/' /etc/locale.gen && \
    sed -i -e 's/# ru_RU.UTF-8 UTF-8/ru_RU.UTF-8 UTF-8/' /etc/locale.gen && \
    sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=ru_RU.UTF-8 && \
    echo "LANGUAGE=ru_RU.UTF-8" >> /etc/default/locale && \
    echo "LC_ALL=ru_RU.UTF-8" >> /etc/default/locale

# Set timezone
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Europe/Kiev /etc/localtime
RUN "date"

WORKDIR /var/www/html
