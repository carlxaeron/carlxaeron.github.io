import firebase from 'firebase/app';
import 'firebase/firestore'; // Import Firestore

export const SKILLS = [
    {
        name: "Javascript (JS)",
        experience: "11",
        percentage: "95",
        width: "95",
        parent: true,
    },
    {
        name: "ReactJS",
        experience: "3",
        percentage: "95",
        width: "95",
    },
    {
        name: "Firebase",
        experience: "2",
        percentage: "85",
        width: "85",
    },
    {
        name: "NodeJS (Backend)",
        experience: "1",
        percentage: "80",
        width: "80",
    },
    {
        name: "JQuery",
        experience: "7",
        percentage: "95",
        width: "95",
    },
    {
        name: "AngularJS",
        experience: "2",
        percentage: "90",
        width: "90",
    },
    {
        name: "VueJS",
        experience: "3",
        percentage: "95",
        width: "95",
    },
    {
        name: "Mobile Development",
        experience: "1",
        percentage: "80",
        width: "80",
        parent: true,
    },
    {
        name: "Flutter",
        experience: "1",
        percentage: "80",
        width: "80",
    },
    {
        name: "React Native",
        experience: "1",
        percentage: "85",
        width: "85",
    },
    {
        name: "PHP",
        experience: "10",
        percentage: "95",
        width: "95",
        parent: true,
    },
    {
        name: "Laravel",
        experience: "9",
        percentage: "95",
        width: "95",
    },
    {
        name: "CodeIgniter",
        experience: "3",
        percentage: "90",
        width: "90",
    },
    {
        name: "Zend",
        experience: "1",
        percentage: "80",
        width: "80",
    },
    {
        name: "WordPress CMS",
        experience: "5",
        percentage: "90",
        width: "90",
    },
    {
        name: "Joomla CMS",
        experience: "1",
        percentage: "75",
        width: "75",
    },
    {
        name: "SQL (MYSQL)",
        experience: "9",
        percentage: "95",
        width: "95",
    },
    {
        name: "NPM",
        experience: "7",
        percentage: "90",
        width: "90",
        parent: true,
    },
    {
        name: "Gulp / Bower / Webpack",
        experience: "5",
        percentage: "90",
        width: "90",
    },
    {
        name: "LESS / SCSS / Stylus",
        experience: "7",
        percentage: "95",
        width: "95",
    },
    {
        name: "CSS/CSS3",
        experience: "10",
        percentage: "95",
        width: "95",
        parent: true,
    },
    {
        name: "Twitter Bootstrap",
        experience: "6",
        percentage: "90",
        width: "90",
    },
    {
        name: "TailwindCSS",
        experience: "4",
        percentage: "95",
        width: "95",
    },
    {
        name: "HTML/HTML5",
        experience: "10",
        percentage: "95",
        width: "95",
        parent: true,
    },
    {
        name: "Jade Template",
        experience: "6",
        percentage: "95",
        width: "95",
    },
    {
        name: "Pug Template",
        experience: "6",
        percentage: "95",
        width: "95",
    },
    {
        name: "Version Control",
        experience: "9",
        percentage: "95",
        width: "95",
        parent: true,
    },
    {
        name: "Git/SVN",
        experience: "11",
        percentage: "95",
        width: "95",
    },
    {
        name: "Others",
        experience: "6",
        percentage: "85",
        width: "85",
        parent: true,
    },
    {
        name: "Photoshop",
        experience: "5",
        percentage: "85",
        width: "85",
    },
    {
        name: "Illustrator",
        experience: "2",
        percentage: "85",
        width: "85",
    },
    {
        name: "Word Office Tools",
        experience: "8",
        percentage: "90",
        width: "90",
    }
];

export const PROJECT_DESCRIPTION = 'I am a fullstack web developer working for over 12 years since 2012, I am mainly focused on web development using HTML, CSS, JS (AngularJS, VueJS, JQuery), PHP/MySQL - (XAMPP, WAMP, LAMP). I build website from scratch using any top frameworks such as Laravel, Codeigniter, and Zend on any development environment with support of Linux command or local development environment and my code is up to the current standards, secure, and safe from SQL injections or similar hacking attempts with understanding of OOP. I could be a maintenance support with high analytical thinking skill to solve complex problems. All the websites I developed was built using the latest version of PHP. I have knowledge on building a website from CMS such as Wordpress, Drupal and Joomla, I could make customized themes. I have experienced in SEO friendly website that may affect the visibility of a website or a web page in a search engine’s results. I always adopt latest technologies to meet the market requirements and I am creating a responsive web design that loads correctly in all modern browsers and smaller devices.';
export const PROJECTS_DESCRIPTION_AI = <>
    <br />
    <p> With over 12 years of experience in full - stack web development,
    I specialize in building secure, scalable websites using HTML, CSS, JavaScript(ReactJS, AngularJS, VueJS, JQuery), PHP / MySQL, and NodeJS.I work with top frameworks like Laravel, CodeIgniter, and Zend, ensuring that all code is up - to - date, secure, and optimized
for performance. </p> 
    <p> I am skilled in both Linux and local development environments, with a focus on OOP principles, SQL injection prevention, and high analytical problem - solving.My experience extends to CMS platforms like WordPress, Drupal, and Joomla, with custom theme development and SEO optimization to improve search visibility. </p>
    <p> I continuously adopt the latest technologies to create responsive, cross - browser web designs that work seamlessly across all devices. </p>
</>

export const COMPANIES = [
    {
        id: 'eco',
        projects: [
            {
                id: 'eco',
            },
        ],
        title: 'Ecoshift Corp',
    },
    {
        id: 'abs',
        projects: [
            {
                id: 'sc',
            },
            {
                id: 'kty',
                imgType: 'png',
            },
            {
                id: 'push',
            },
            {
                id: 'corp',
                imgType: 'png',
            },
            {
                id: 'careers',
                imgType: 'png',
            },
            {
                id: 'anc',
                imgType: 'png',
            },
            {
                id: 'kaiaq',
                imgType: 'png',
            },
        ],
        title: 'ABS-CBN Corp',
    },
    {
        id: 'game',
        projects: [
            {
                id: 'asphaltnitro',
            },
            {
                id: 'asphalt8',
            },
            {
                id: 'cc',
            },
            {
                id: 'dm',
                imgType: 'png',
            },
            {
                id: 'dh5',
            },
            {
                id: 'gl-forum',
            },
            {
                id: 'gor',
            },
            {
                id: 'hoc',
                imgType: 'png',
            },
            {
                id: 'sf',
            },
            {
                id: 'tbc',
            },
        ],
        title: 'Gameloft Philippines',
    },
    {
        id: 'cons',
        projects: [
            {
                id: false,
            },
        ],
        title: 'ConsumerCloud Services Inc',
    },
    {
        id: 'hux',
        projects: [
            {
                id: 'coll8or',
                imgType: 'png',
            },
            {
                id: 'kinkcakes',
            },
        ],
        title: 'Huxxer Corp',
    },
    {
        id: 'zen',
        projects: [
            {
                id: 'zmr',
                imgType: 'png',
            },
            {
                id: 'zbceuit',
                imgType: 'png',
            },
            {
                id: 'zgi',
                imgType: 'png',
            },
        ],
        title: 'Zeno Group Investsments Inc',
    },
    {
        id: 'lee',
        projects: [
            {
                id: false,
            },
        ],
        title: 'Leekie Enterprises Inc',
    },
    {
        id: 'vig',
        projects: [
            {
                id: 'vigattintourism',
            },
            {
                id: 'vigattindeals',
                imgType: 'png',
            },
            {
                id: 'vigattintrade',
                imgType: 'png',
            },
            {
                id: 'vigattin',
            },
        ],
        title: 'Vigattin Inc',
    },
]

export const EXPERIENCES = [
    {
        "companyLogo": "/static/images/companies/mb.jpg",
        "companyName": "Metropolitan Bank & Trust (Metrobank).",
        "jobTitle": "Programmer Analyst",
        "dateRange": "(Aug 2022- Present)",
        // "jobDescription": `•	Developed and maintained banking applications, ensuring secure and efficient financial transactions.<br />•	Collaborated with cross-functional teams to analyze requirements and implement technical solutions that improved system functionality.•	Conducted thorough testing and debugging to maintain high system reliability and minimize errors. In testing we used jest, enzyme, and cypress for end to end testing. We used gitlab for version control and jira for project management. In communicating with backend if we need to get some data we used postman for API testing and mockoon for mocking the API while the backend is not yet finished. Upon developing the frontend we used reactjs and redux for state management and also if there is need to improve the the frontend design i used also a technique for pixel-perfect from desktop to mobile. We also have every day standup meeting to discuss the progress of the project and if there is any blocker we need to escalate it to the team lead and also with testers and BA.`,
        "jobDescription": `	•	Developed and maintained banking applications, ensuring secure, efficient, and reliable financial transactions in alignment with industry standards.<br />
	•	Collaborated with cross-functional teams, including testers and business analysts, to analyze requirements, design technical solutions, and enhance system functionality.<br />
	•	Executed comprehensive testing and debugging to ensure system reliability and minimize errors. Utilized tools like Jest, Enzyme, and Cypress for end-to-end testing, GitLab for version control, and Jira for project management.<br />
	•	Streamlined API integration by leveraging Postman for API testing and Mockoon for mocking APIs during development phases, enabling seamless communication with backend systems even before completion.<br />
	•	Developed the frontend using ReactJS and Redux for efficient state management. Applied pixel-perfect techniques to achieve consistent and responsive designs across desktop and mobile platforms.<br />
	•	Participated in daily stand-up meetings to track project progress, address blockers, and ensure alignment among team members, including testers and business analysts.`
    },
    {
        "companyLogo": "/static/images/companies/eco.jpg",
        "companyName": "Ecoshift Corp.",
        "jobTitle": "Web App Developer",
        "dateRange": "(Feb 2019- July 2022)",
        // "jobDescription": " My job is to maintain the codes, enhance, debug the site. Make a custom plugin to work in woocommerce and additional features. Fix different bugs on design/layout. Fix website to make it more SEO friendly."
        "jobDescription": "In my role at Ecoshift Corp., I was responsible for the ongoing maintenance, enhancement, and debugging of the company’s website. I developed custom plugins tailored for WooCommerce, adding new features and functionalities to meet business needs. My work also included troubleshooting and fixing various design and layout issues, ensuring the site maintained a professional and user-friendly appearance. Additionally, I optimized the website for SEO, implementing strategies to improve search engine visibility and site performance."
    },
    {
        "companyLogo": "/static/images/companies/abscbn.png",
        "companyName": "ABS-CBN Corp.",
        "jobTitle": "Frontend Developer",
        "dateRange": "(Sep 2016- Feb 2019)",
        // "jobDescription": "My responsibilities are make webpages that made of HTML, CSS, and JavaScript. By using latest and updated technology and using NPM we build some webpages that is supported the GULP task management. I used LESS, SASS for managing the CSS. I used webpack for compiling and just all the plugins or JavaScript in one file. I used JADE template for building the HTML file. Make the webpage supports all browsers from desktop to mobile devices. I finished three websites from scratch."
        "jobDescription": "At ABS-CBN Corp., I was responsible for developing responsive and cross-browser-compatible web pages using modern front-end technologies. I utilized HTML, CSS, and JavaScript, integrating tools like NPM and Gulp for efficient task management. For CSS, I managed styles using LESS and SASS, ensuring modular and maintainable code. I also implemented Webpack for bundling JavaScript, optimizing performance by compiling all scripts into a single file. Using the JADE templating engine, I built dynamic HTML files that adapted seamlessly across desktop and mobile devices. During my tenure, I successfully completed three websites from scratch, delivering robust and high-quality results."
    },
    {
        "companyLogo": "/static/images/companies/gl.png",
        "companyName": "Gameloft Philippines",
        "jobTitle": "R&D PHP Developer",
        "dateRange": "(Aug 2015- Jul 2016)",
        // "jobDescription": "My responsibilities are doing the development for backend of the website after the projects are done from the designer and frontend developer. I'm doing the functionality of the website by using any frameworks. I used the zend framework 2 here and develop the website on cloud9 and in linux environment. I've learned here the zf2 framework, PHP unit testing (PHPUnit, selenium), js unit testing (karma.js, javascript frameworks(jQuery, angular.js), node.js, bower, etc."
        "jobDescription": "At Gameloft Philippines, I was responsible for developing the backend functionality of websites after the design and frontend stages were completed. I used the Zend Framework 2, leveraging my expertise to create robust and scalable web solutions in a Linux environment using Cloud9. I gained hands-on experience in PHP unit testing (PHPUnit, Selenium) and JavaScript unit testing (Karma.js). Additionally, I worked with a variety of JavaScript frameworks, including jQuery and AngularJS, and utilized Node.js and Bower for efficient development processes."
    },
    {
        "companyLogo": "/static/images/companies/ccs.png",
        "companyName": "ConsumerCloud Services Inc.",
        "jobTitle": "Senior PHP Developer",
        "dateRange": "(Mar 2015- Aug 2015)",
        // "jobDescription": "The Australian client has LGS System, this is large system contains large data came from surveys and clients and are paying for every valid data and it is hosted in AWS (Amazon Web Services). My job as senior web developer is to document the system's flow so we can fix anything that needs by client to be fixed and support the junior developer."
        "jobDescription": "As a Senior Web Developer, I managed the documentation of the LGS System for an Australian client. The LGS System is a complex platform hosted on AWS, handling vast amounts of survey and client data, with clients paying for each validated entry. My responsibilities included thoroughly documenting the system’s flow to identify areas for improvement, addressing client-reported issues, and collaborating closely with junior developers to provide support and guidance, ensuring the efficient operation of the platform."
    },
    {
        "companyLogo": "/static/images/companies/huxxer.png",
        "companyName": "Huxxer Corp.",
        "jobTitle": "Senior Web Developer",
        "dateRange": "(Dec 2014- Mar 2015)",
        // "jobDescription": "My responsibilities in one of our became clients are developed the two of the system using the laravel framework owned by one of the Australian client; one is Dontudare.com is about a social app that may post anonymously for the security purposes of the user and one is Coll8or is the social app that consists of many social API in one website. In our local client I developed a cake management web app from not optimized laravel kinkcakes made by last developers to scratch laravel kinkcakes."
        "jobDescription": `	•	Developed two systems using the Laravel framework for an Australian client:<br />
	•	Dontudare.com: A social app enabling users to post anonymously, enhancing user privacy and security.<br />
	•	Coll8or: A social platform integrating multiple social APIs, providing users with a consolidated social media experience on a single website.<br />
	•	For a local client, rebuilt and optimized Kinkcakes, a cake management web app, from an unoptimized Laravel version into a fully optimized solution developed from scratch.<br />
	•	Ensured all applications met client requirements and were delivered with high performance, scalability, and user-friendly interfaces.`
    },
    {
        "companyLogo": "/static/images/companies/zeno.png",
        "companyName": "Zeno Group Investsments Inc.",
        "jobTitle": "Web Admin",
        "dateRange": "(Jul 2014- Dec 2014)",
        // "jobDescription": "My job is to create websites made with wordpress and customized or own themes from my leader or CEO on UK with support from his COO here in the Philippines. I made a 30+ websites from PSD to HTML and from scratch. I used also laravel PHP framework here on websites that dont need to be CMS."
        "jobDescription": `	•	Developed and customized WordPress websites, creating and implementing custom themes based on designs from the CEO in the UK, with support from the COO in the Philippines.<br />
	•	Successfully built over 30 websites, converting PSD designs into responsive HTML/CSS layouts and developing some projects from scratch.<br />
	•	Utilized the Laravel PHP framework for websites that did not require CMS integration, ensuring secure, efficient, and scalable solutions tailored to specific project needs.<br />
	•	Ensured all sites were optimized for performance, SEO-friendly, and compatible across various devices and browsers.<br /><br />

<b>Technologies Used:</b> WordPress, Laravel, HTML, CSS, PHP, PSD to HTML conversion`
    },
    {
        "companyLogo": "/static/images/companies/leekie.jpg",
        "companyName": "Leekie Enterprises Inc.",
        "jobTitle": "Web Developer",
        "dateRange": "(Apr 2014- Jul 2014)",
        // "jobDescription": "My responsilities are doing my task as a Web Developer based on the given task to give their expectation for the gaming website. Share ideas what I have learned from the recent work experience. My achievements is to share my ideas/experiences from what I have learned and show them that I am not the ordinary programmer."
        "jobDescription": "As a Web Developer at Leek Enterprises Inc., I was responsible for developing gaming websites according to client specifications and expectations. My role involved collaborating with the team and sharing my knowledge from previous projects to enhance the website’s features and functionality. I actively contributed ideas and applied my experience to ensure that the final product met high-quality standards, aiming to provide more than just basic solutions and demonstrating innovative approaches in web development."
    },
    {
        "companyLogo": "/static/images/companies/vigattin.jpg",
        "companyName": "Vigattin Inc.",
        "jobTitle": "Web Developer",
        "dateRange": "(May 2012- Apr 2014)",
        // "jobDescription": "My job is to develop the 4 websites. Web Designing, Coding, Debugging and Web Security. I used CodeIgniter PHP framework here. I made 2 websites here from scratch and I update/enhance other websites here."
        "jobDescription": "As a Web Developer at Vigattin Inc., I was responsible for developing and maintaining four websites using the CodeIgniter PHP framework. My role encompassed a range of tasks, including web design, coding, debugging, and implementing web security measures. I successfully built two websites from scratch and updated or enhanced additional sites, ensuring optimal performance and functionality. My work aimed at creating secure, responsive, and user-friendly websites that align with client requirements and industry standards."
    },
]

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
};

// Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore(); // Get a reference to the Firestore database

// export { db }; // Export the Firestore instance