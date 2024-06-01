FROM ubuntu:22.04

RUN export DEBIAN_FRONTEND=noninteractive && \
    export DEBCONF_NONINTERACTIVE_SEEN=true && \
    apt update && apt install -y \
    nodejs \
    npm \
    supervisor \
    mysql-server \
    php \
    libnss3 libgbm1 libasound2

RUN sed -i -e"s/^bind-address\s*=\s*127.0.0.1/bind-address = 0.0.0.0/" /etc/mysql/my.cnf
COPY config/init.sql /tmp/init.sql
RUN /usr/sbin/mysqld & sleep 10 && mysql < /tmp/init.sql

RUN echo "root:root" | chpasswd

RUN apt-get clean
RUN rm -rf /var/cache/apt/archives/* /var/lib/apt/lists/*

RUN mkdir -p /ws
RUN mkdir -p /testinternal

COPY challenge/testinternal /testinternal

WORKDIR /ws
COPY challenge/ws .

RUN npm install

COPY config/supervisord.conf /etc/supervisord.conf

EXPOSE 80
EXPOSE 8080

ENV MYSQL_USER web
ENV MYSQL_PASSWORD REDACTED
ENV SESSION_KEY REDACTED
ENV USERNAME admin
ENV PASSWORD REDACTED
ENV FLAG FUSEC{test_flag}

RUN echo FUSEC{test_flag} > /flag

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]