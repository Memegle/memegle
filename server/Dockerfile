# Build ENV base image
FROM gradle:6.3.0-jdk8 AS build

COPY . /home/gradle/src
WORKDIR /home/gradle/src

# Exclude test for the time being
RUN gradle build --no-daemon -x test

# Production environment (Tomcat 10 doesn't work for unknown reason)
FROM tomcat:9-jdk8-openjdk

EXPOSE 8080

# remove previous files from deploy directory and copy current over
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /home/gradle/src/build/libs/*.war /usr/local/tomcat/webapps/ROOT.war
COPY ./scripts/init-boot.sh ./init-boot.sh

ENV CATALINA_OPTS -Dsecurerandom.source=file:/dev/urandom