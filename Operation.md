Operation manual
=================

# Configuration
On the [src/config.js](src/config.js) folder, you can find all configuration needed for development and production usage.

#### How it works

Customers can customize some configurations using Global browser variables like `version` at the [src/config.js](src/config.js) file.


# Serve for development

The `gulp watch` command runs a proxy server to `localhost:8080` so you have to serve both addresses.

A script is ready doing this automatically, just run:

```bash
npm run serve
```

To finish the `http-server` process, after hitting interrupting the watch process, get the http-server process with unix's `fg` command and then interrupt. Or just close the terminal tab/window.

# Build for production
```bash
gulp --production
```

[dev-publish.sh](dev-publish.sh) is a script that facilitates the process of coping the production build to the project responsible for serving it.