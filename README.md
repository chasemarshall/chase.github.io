# chase.github.io

This repository contains the source code for my personal website. The site is a small static project with a couple of pages:

- **about** – some words about me (home page)
- **music** – a web based music player for my favorite tracks
- **work** – a collection of projects I've built

The page uses a little JavaScript for the music player and a floating music indicator. Everything is built with plain HTML, CSS and JS so it can be hosted anywhere.

## Development

The project includes a basic `package.json` so you can start a local server with:

```bash
npm start
```

This uses [http-server](https://www.npmjs.com/package/http-server) to serve the static files on port 8080.

The music player remembers your last track and position so you can browse other pages without losing your place.

Feel free to clone the repo and customize it!
