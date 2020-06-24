# Build ENV base image
FROM gradle:6.3.0-jdk8 AS build
COPY --chown=gradle:gradle . /home/gradle/src

# Only copy dependency-related files
# COPY build.gradle gradle.properties settings.gradle /app/

# Only download dependencies
# Eat the expected build failure since no source code has been copied yet
RUN gradle clean build --no-daemon > /dev/null 2>&1 || true

# Copy all files
COPY ./ /app/

WORKDIR /home/gradle/src

# Exclude test for the time being
RUN gradle build --no-daemon -x test

# Production environment
FROM tomcat:9.0.33-jdk8-openjdk-slim

EXPOSE 8080

RUN rm -rf /usr/local/tomcat/webapps/*
COPY --from=build /home/gradle/src/build/libs/*.war /usr/local/tomcat/webapps/ROOT.war

ENV CATALINA_OPTS -Dsecurerandom.source=file:/dev/urandom

# Deploy application
CMD ["catalina.sh", "run"]
