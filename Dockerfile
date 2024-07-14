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

RUN echo "shared_preload_libraries='age'" >> /usr/share/postgresql/postgresql.conf.sample
RUN cat <<EOF > /docker-entrypoint-initdb.d/00-create-extension-age.sql
CREATE EXTENSION age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;
ALTER DATABASE postgres SET search_path TO ag_catalog, "$user", public;
EOF
