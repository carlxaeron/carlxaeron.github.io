module.exports = {
    mode: 'jit', // use JIT (Just-In-Time) mode for better performance and smaller bundle sizes.
    // purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // purge unused styles from your HTML and component files to reduce bundle sizes and improve performance.
    // theme: {
    //     colors: {
    //         primary: '#007bff', // define your custom colors here.
    //     },
    // },
    // content: [
    //     "./src/**/*.{js,jsx,ts,tsx}",
    // ],
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // specify the paths to all of the template files in your project
    plugins: [],
    theme: {
        extend: {},
    },
};