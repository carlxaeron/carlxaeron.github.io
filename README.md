# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Directory Structure

The repository contains the following directories and files:

### `docs`

Contains the build output and static assets for the project. It includes files such as `docs/index.html`, `docs/asset-manifest.json`, and various static assets like CSS, JavaScript, and media files.

### `functions`

Contains server-side code for Firebase functions.

* `functions/index.js`: The main entry point for the Firebase Cloud Functions.
* `functions/helper.js`: Contains helper functions for sending success and error responses.
* `functions/external-config.js`: Contains configuration data used by the functions defined in `index.js`.
* `functions/.env.example`: Provides an example environment variable configuration.
* `functions/package.json`: Defines the dependencies and scripts for the Firebase Cloud Functions.

### `public`

Contains static files that are used during the build process and are copied to the build output. It includes files such as `public/index.html`, `public/asset-manifest.json`, and other static assets like CSS, JavaScript, and media files.

### `src`

Contains the main source code for the React application.

* `src/assets`: Contains static assets like images, fonts, and styles.
* `src/components`: Contains reusable React components.
* `src/containers`: Contains container components that manage state and logic.
* `src/pages`: Contains page components that represent different routes in the application.
* `src/styles`: Contains global styles and CSS files.
* `src/config.js`: Contains configuration settings for the application.

### `.github`

Contains GitHub-specific configuration files and workflows.

### `.env.example`

Provides an example environment variable configuration.

### `.firebaserc`

Contains Firebase project configuration.

### `.gitignore`

Specifies files and directories to be ignored by Git.

### `build-to-docs.js`

A script to copy the build output to the `docs` directory.

### `firebase.json`

Contains Firebase project configuration.

### `gulpfile.js`

Defines tasks for the Gulp task runner.

### `package.json`

Defines the dependencies and scripts for the project.

### `postcss.config.js`

Contains PostCSS configuration.

### `tailwind.config.js`

Contains Tailwind CSS configuration.

### `webpack.config.js`

Contains Webpack configuration.

## Differences between `docs` and `public` directories

The `docs` and `public` directories serve different purposes in the repository:

* The `docs` directory contains the build output and static assets for the project. It includes files such as `docs/index.html`, `docs/asset-manifest.json`, and various static assets like CSS, JavaScript, and media files.
* The `public` directory contains static files that are used during the build process and are copied to the build output. It includes files such as `public/index.html`, `public/asset-manifest.json`, and other static assets like CSS, JavaScript, and media files.

In summary, the `docs` directory holds the final build output, while the `public` directory contains the static files used during the build process.
