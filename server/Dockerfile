# cache
FROM gradle:6.3.0-jdk8 AS cache
RUN mkdir -p /home/gradle/cache_home
ENV GRADLE_USER_HOME /home/gradle/cache_home
COPY build.gradle /home/gradle/server/
WORKDIR /home/gradle/server
RUN gradle clean build --no-daemon > /dev/null 2>&1 || true

# Build ENV base image
FROM gradle:6.3.0-jdk8 AS build
COPY --chown=gradle:gradle --from=cache /home/gradle/cache_home /home/gradle/.gradle
COPY . /home/gradle/src
WORKDIR /home/gradle/src

# Exclude test for the time being
RUN gradle build -i --no-daemon -x test

# Production environment
FROM tomcat:9.0.33-jdk8-openjdk-slim

EXPOSE 8080

# remove previous files from deploy directory and copy current over
RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /home/gradle/src/build/libs/*.war /usr/local/tomcat/webapps/ROOT.war

ENV CATALINA_OPTS -Dsecurerandom.source=file:/dev/urandom

# Deploy application
CMD ["catalina.sh", "run"]
