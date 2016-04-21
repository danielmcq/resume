# Resume

## Intro
This is a work in progress of my web app to produce various versions of my resume using templates. The idea is that often times it is beneficial to custom tailor a resume for each potential employer. However, it can be time consuming to re-write or manipulate text in most word processors. This allows the different aspects of the resume data to be saved in a data store and be injected into templates.

## Installing and running
1. Clone this repo.
2. Inside of a terminal/command prompt, run `npm install` from within the cloned directory.
3. Run `node server.js`. You can use something like nodemon for development. In a production environment, pm2 or forever can be used to keep the site running.
4. Navigate to your browser at http://localhost:3000/

## Developing
If you have eslint installed globally, you can run `eslint server.js src` from within the root of the project to ensure that the JS code matches the existing styles.

If you have jasmine installed globally, you can run `jasmine` from within the root of the project to run the test specs.

## Demo
You can see this in action with my own personal resume information at http://resume.dehugo.net/