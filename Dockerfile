FROM postgres:16 AS BASE

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends --no-install-suggests \
       curl \
       ca-certificates \
       bison \
       build-essential \
       flex \
       postgresql-server-dev-16 \
       locales \
       tar

WORKDIR /src/

RUN curl -fsSL https://github.com/apache/age/releases/download/PG16%2Fv1.5.0-rc0/apache-age-1.5.0-src.tar.gz -o /tmp/apache-age-1.5.0-src.tar.gz
RUN tar -xzvf /tmp/apache-age-1.5.0-src.tar.gz -C /src/ --strip-components=1

RUN make && make install

FROM postgres:16

COPY --from=BASE /usr/lib/postgresql/16/lib/age.so /usr/lib/postgresql/16/lib/age.so
COPY --from=BASE /usr/lib/postgresql/16/lib/bitcode/ /usr/lib/postgresql/16/lib/bitcode/
COPY --from=BASE /usr/share/postgresql/16/extension/age--1.5.0.sql /usr/share/postgresql/16/extension/age--1.5.0.sql
COPY --from=BASE /usr/share/postgresql/16/extension/age.control /usr/share/postgresql/16/extension/age.control

RUN apt-get update -y \
    && apt install -y curl

ARG PG_VERSION_MAJOR=16
ARG PG_SEARCH_VERSION=0.7.6

ENV PG_BM25_VERSION=${PG_BM25_VERSION}
RUN curl -fsSL https://github.com/paradedb/paradedb/releases/download/v${PG_SEARCH_VERSION}/pg_search-v${PG_SEARCH_VERSION}-debian-12-amd64-pg${PG_VERSION_MAJOR}.deb -o /tmp/pg_search.deb
RUN dpkg -i /tmp/pg_search.deb
RUN rm /tmp/pg_search.deb

RUN echo "shared_preload_libraries='pg_search,age'" >> /usr/share/postgresql/postgresql.conf.sample
