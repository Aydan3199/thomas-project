# Dockerfile for Spring Boot Backend on Render
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace/app

# Copy gradle files
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Ensure gradlew is executable
RUN chmod +x gradlew

# Build dependencies
RUN ./gradlew dependencies --no-daemon

# Copy source code and build
COPY src src
RUN ./gradlew build -x test --no-daemon

# Run stage
FROM eclipse-temurin:21-jre-jammy
EXPOSE 8080
COPY --from=build /workspace/app/build/libs/*-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
