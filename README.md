# War

This is the browser version of a class-based war2-inspired game made using NodeJS, Typescript and WebGL2.

# Compiling

Make sure you have `node` and `npm` installed on your system. I'm currently using `node v16.13.0` and `npm 8.1.0`

First you'll need to compile the backend, to do so, just go to the backend folder and compile it as:
```
cd backend
npm install
tsc
```
After this you can compile the frontend as:
```
cd ../frontend
npm install
npm run compile
```
> For the time being, the backend just refers to the frontend out folder to serve the website instead of being in a proper distribution directory.

With everything compiled it can be executed as:
```
node backend/out/index.js
```