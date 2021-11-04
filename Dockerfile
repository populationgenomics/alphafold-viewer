FROM alpine:3.13.2

# by default listen on 8000
ENV PORT 8000
EXPOSE $PORT

# Install thttpd
RUN apk add thttpd

# Create a non-root user to own the files and run our server
RUN adduser -D static
USER static
WORKDIR /home/static

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
COPY . .

# Run thttpd
CMD ["thttpd", "-D", "-h", "0.0.0.0", "-p", $PORT, "-d", "/home/static", "-u", "static", "-l", "-", "-M", "60"]