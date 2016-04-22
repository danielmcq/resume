# Resume

## Intro
This is a work in progress of my web app to produce various versions of my resume using templates. The idea is that often times it is beneficial to custom tailor a resume for each potential employer. However, it can be time consuming to re-write or manipulate text in most word processors. This allows the different aspects of the resume data to be saved in a data store and be injected into templates.

## Installing and running
1. Clone this repo.
2. Inside of a terminal/command prompt, run `npm install` from within the cloned directory.
3. Setup data. Either a JSON file can be used or a a Firebase data source. By default, the app looks for a file named `data.json` in the root of the project. The file `dataTemplate.json` can be used to create `data.json`. If a different filename is desired, a new configuration file can be created in the `./config/` directory and the `dataSource.location` key should specify the name of the other file. If you Firebase is used for the data store, then `dataTemplate.json` can be imported to setup the data store. Then, the new config file should be updated so that `dataSource.type` is changed to `"firebase"` and `dataSource.location` reflects the root of the Firebase data store, ie `https://myfirebaseapp.firebaseio.com/`.
4. Run `node server.js`. You can use something like nodemon for development. In a production environment, pm2 or forever can be used to keep the site running.
5. Navigate to your browser at http://localhost:3000/

## Developing
If you have eslint installed globally, you can run `eslint server.js src` from within the root of the project to ensure that the JS code matches the existing styles.

If you have jasmine installed globally, you can run `jasmine` from within the root of the project to run the test specs.

## Demo
You can see this in action with my own personal resume information at http://resume.dehugo.net/