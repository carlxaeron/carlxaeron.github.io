const SKILLS = [
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
    name: "Cloud",
    experience: "2",
    percentage: "80",
    width: "80",
    parent: true,
  },
  {
    name: "Google Cloud Platform (GCP)",
    experience: "2",
    percentage: "80",
    width: "80",
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

const PROJECT_DESCRIPTION = 'I am a fullstack web developer working for over 12 years since 2012, I am mainly focused on web development using HTML, CSS, JS (AngularJS, VueJS, JQuery), PHP/MySQL - (XAMPP, WAMP, LAMP). I build website from scratch using any top frameworks such as Laravel, Codeigniter, and Zend on any development environment with support of Linux command or local development environment and my code is up to the current standards, secure, and safe from SQL injections or similar hacking attempts with understanding of OOP. I could be a maintenance support with high analytical thinking skill to solve complex problems. All the websites I developed was built using the latest version of PHP. I have knowledge on building a website from CMS such as Wordpress, Drupal and Joomla, I could make customized themes. I have experienced in SEO friendly website that may affect the visibility of a website or a web page in a search engine’s results. I always adopt latest technologies to meet the market requirements and I am creating a responsive web design that loads correctly in all modern browsers and smaller devices.';
const PROJECT_DESCRIPTION2 = `I am a passionate Full-Stack Web Developer with over 12 years (4560 days 19 hrs 14 mins 17 secs) experience delivering robust web applications and responsive websites since 2012. My expertise spans a wide range of modern technologies, enabling me to create solutions that are secure, scalable, and user-focused.
🔑 Core Expertise:
Proficient in front-end development using HTML, CSS, and modern JavaScript frameworks like AngularJS, VueJS, ReactJS, and jQuery.
Advanced backend skills with PHP/MySQL ecosystems (XAMPP, WAMP, LAMP) and frameworks like Laravel, CodeIgniter, and Zend.
Extensive experience in CMS platforms such as WordPress, Drupal, and Joomla, with a track record of building custom themes and optimizing for SEO.
💡 What Sets Me Apart:
I follow Object-Oriented Programming principles and adhere to the latest coding standards, ensuring secure and resilient applications against vulnerabilities like SQL injections.
Strong problem-solving and analytical skills, enabling me to deliver innovative solutions to complex technical challenges.
Commitment to seamless user experiences with responsive web designs optimized for cross-browser and mobile compatibility.
📈 Beyond Development:
Skilled in creating SEO-friendly websites that enhance search engine visibility and drive user engagement.
Experience in mobile development using Flutter and integrating backend solutions with Firebase.
Proficient in providing maintenance and support for ongoing projects, ensuring they remain efficient, reliable, and up to date.
💻 On the Cutting Edge:
I stay ahead of industry trends, constantly refining my skill set to meet market demands. My dedication to professional growth and collaboration fuels my ability to bring innovative ideas to life.
I am excited to connect with like-minded professionals and organizations seeking a creative, detail-oriented, and results-driven developer to transform digital visions into reality.`;

const COMPANIES = [
  {
      id: 'gad',
      title: 'GoAutoDial Inc',
      projects: [
          {
              id: 'agent',
              imgType: 'png',
              title: 'Agent Web Application',
          },
      ],
  },
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
              title: 'Star Cinema',
          },
          {
              id: 'kty',
              imgType: 'png',
              title: 'Kapamilya Thank You',
          },
          {
              id: 'push',
              title: 'Push Redesign',
          },
          {
              id: 'corp',
              imgType: 'png',
              title: 'Corporate',
          },
          {
              id: 'careers',
              imgType: 'png',
              title: 'Careers',
          },
          {
              id: 'anc',
              imgType: 'png',
              title: 'ANC Form',
          },
          {
              id: 'kaiaq',
              imgType: 'png',
              title: 'KAIAQ Admin Template',
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

const EXPERIENCES = [
  {
      "companyLogo": "/static/images/companies/mb.jpg",
      "companyName": "Metropolitan Bank & Trust (Metrobank).",
      "jobTitle": "Programmer Analyst",
      "dateRange": "(Aug 2022- Present)",
      "skills": ['ReactJS', 'Redux', 'Jest', 'GitLab', 'Jira', 'Postman', 'Mockoon', 'Pixel-Perfect', 'Standup Meeting', 'Unit-Tesing', 'End-to-End Testing', 'API Implementation to UI', 'Frontend Development', 'Responsive Design', 'Bug Fixing'],
      // "jobDescription": `•	Developed and maintained banking applications, ensuring secure and efficient financial transactions.<br />•	Collaborated with cross-functional teams to analyze requirements and implement technical solutions that improved system functionality.•	Conducted thorough testing and debugging to maintain high system reliability and minimize errors. In testing we used jest, enzyme, and cypress for end to end testing. We used gitlab for version control and jira for project management. In communicating with backend if we need to get some data we used postman for API testing and mockoon for mocking the API while the backend is not yet finished. Upon developing the frontend we used reactjs and redux for state management and also if there is need to improve the the frontend design i used also a technique for pixel-perfect from desktop to mobile. We also have every day standup meeting to discuss the progress of the project and if there is any blocker we need to escalate it to the team lead and also with testers and BA.`,
      "jobDescription": `• Designed and maintained secure and efficient banking applications, ensuring financial transactions to an industry standard.<br/>
• Worked closely with cross-functional teams, including testers and business analysts, to understand requirements from all aspects in order to engineer a technical solution and improve system functionality.<br/>
• Focus on delivering high-quality results by thoroughly maintaining toolsets, testing, and debugging such as Jest, Enzyme, Cypress while tracking modifications on projects using GitLab and sometimes Jira.<br/>
• Simplified API integration by utilizing Postman for testing and Mockoon to simulate APIs during development, thus enabling front-end work to proceed when the back-end is not yet ready.<br/>
• Created intuitive and responsive frontends by ReactJS and Redux which closely knitted to the pixel-perfect designs functioning amazingly well on the desktop and mobile.<br/>
• Make sure active participation on a daily stand up, giving updates that address challenges with the team, especially testers and business analysts to line up.`
  },
  {
      "companyLogo": "/static/images/companies/GAD.jpeg",
      "companyName": "GoAutoDial, Inc.",
      "jobTitle": "Web Application Developer (Part-time/Remote)",
      "dateRange": "(Jan 2022 - Present)",
      "skills": ['Laravel', 'ReactJS', 'WHMCS', 'PHP', 'User Experience', 'Bug Fixing'],
      "jobDescription": `At GoAutoDial, Inc, I have spearheaded the entire modernization of the Agent Web Application-the Word of the call center agents for managing and dialing leads. It was initially built with jQuery and PHP, and clearly needed an update to make it up-to-date.<br/>
• The rewrite is carrying out an entirely newly built Laravel Backend and ReactJS Frontend for a more scalable and maintainable application.<br/>
• A cleaner, more user-friendly, fully responsive interface was designed to avoid such hassles and to make it easier for call-center agents to use within their daily processes.<br/>
• It is more performance- and scalability-oriented, meant to ensure that application could carry a higher load without compromising reliability.<br/>
• All of these are efficiency-increasing and boosting user satisfaction at the same time increasing productivity in call center work.<br/>
• Developed a provisioning module for WHMCS which further simplifies cloud service management and automation, thus improving the overall user experience and operational workflows significantly.<br/><br/>

This project was an exciting chance to use technology to inject modern solutions into a workplace that was going to last and be valuable to both the internal team and their user base forever.`
  },
  {
        "companyLogo": "",
        "companyName": "UCC, Cornerstone and MNX",
        "jobTitle": "Fullstack Dev/Engineer & API Integrator (Part-time/Remote)",
        "dateRange": "(Dec 2020- June 2022)",
        "skills": ['PHP', 'Laravel', 'VueJS', 'Flutter', 'Firebase', 'API Integrations', 'Payment Gateways'],
        "jobDescription": `Furthermore, even working with applications for full-stack banking systems; such as, working with PHP and Laravel. HTML, CSS, and VueJS are used for the frontend technologies for the applications to be responsive and user-friendly. <br/><br/>

API Integrator, is mostly for API services on web and mobile applications. Dragonpay is integrated into their payment gateways, and mobile loading is the offering from most of their services. I've developed a mobile app using Flutter and Firebase with end-user experience in mind.<br/><br/>

My Skills: <br/>
• Backend: PHP, Laravel, Websockets, PHPUnit for unit testing, Docker <br/>
• Frontend: HTML, CSS, VueJS <br/>
• Mobile Development: Flutter and Firebase <br/>
• API Integration: Dragonpay and other payment gateways<br/><br/>

Achievements: <br/>
• Created a web application for the bank to load modules and integrated payment gateways. <br/>
• Made an application programming interface for analytics and put together a system for the analysis of election results. <br/>
• Developed a solid, well-scalable mobile application using Firebase from the backend.<br/>
`,
  },
  {
      "companyLogo": "/static/images/companies/eco.jpg",
      "companyName": "Ecoshift Corp.",
      "jobTitle": "Web App Developer (Regular/Remote)",
      "dateRange": "(Feb 2019- July 2022)",
      "skills": ['WooCommerce', 'WordPress', 'SEO', 'Custom Plugins', 'Shopify', 'Email Templating', 'Bug Fixing', 'Design/Layout'],
      // "jobDescription": " My job is to maintain the codes, enhance, debug the site. Make a custom plugin to work in woocommerce and additional features. Fix different bugs on design/layout. Fix website to make it more SEO friendly."
      "jobDescription": `At Ecoshift Corp, I'm currently doing development and maintenance for e-commerce and assisting in improving the two custom WooCommerce plugins that were developed to perform specific functions. Other projects also include designing SEO campaigns for ranking and optimizing traffic through search engines as well as fixing design and layout issues on pages for a more professional look with user-friendliness.<br/><br/>

Also, it dealt with mail templates, making them appealing, warm, branded, and really created for customer engagements.<br/><br/>

Simultaneously, I managed another project for Ecoshift, where the company needed to change its site from Shopify to a customized-built platform. This meant developing a theme and functionalities aligned to the brand and operations. This gave me the opportunity to support both an operational platform and the strategic development of their web presence.`
  },
  {
      "companyLogo": "/static/images/companies/abscbn.png",
      "companyName": "ABS-CBN Corp.",
      "jobTitle": "Frontend Developer",
      "dateRange": "(Sep 2016- Feb 2019)",
      "skills": ['HTML', 'CSS', 'JQuery', 'AngularJS', 'VueJS', 'ReactJS', 'Bootstrap', 'TailwindCSS', 'Jade', 'Pug', 'Gulp', 'Webpack', 'LESS', 'SASS', 'Responsive Design', 'Cross-Browser Compatibility'],
      // "jobDescription": "My responsibilities are make webpages that made of HTML, CSS, and JavaScript. By using latest and updated technology and using NPM we build some webpages that is supported the GULP task management. I used LESS, SASS for managing the CSS. I used webpack for compiling and just all the plugins or JavaScript in one file. I used JADE template for building the HTML file. Make the webpage supports all browsers from desktop to mobile devices. I finished three websites from scratch."
      "jobDescription": `I was responsible for building web pages using HTML, CSS, and JavaScript, always staying up-to-date with the latest tools and technologies. To streamline the process, I used NPM for managing dependencies and GULP for automating tasks. For managing CSS, I worked with LESS and SASS, and I used Webpack to compile JavaScript and bundle all scripts into a single, optimized file.
<br/><br/>
To speed up development, I utilized the JADE template engine for creating HTML files. I made sure every webpage was fully responsive and worked seamlessly across all browsers, whether on desktops or mobile devices. During this time, I had the opportunity to build three complete websites from scratch, which was a rewarding experience.`
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

const HEADERCONFIG = {
  title: "Carl Louis Manuel - Programmer Analyst | Full-Stack Web & App Developer | Software Engineer | 12+ Years of Experience",
  meta: [
    { name: "theme-color", content: "#000000" },
    { name: "description", content: "Experienced Programmer Analyst | Full-Stack Web & App Developer | Software Engineer with 12+ years of expertise in ReactJS, VueJS, AngularJS, NodeJS, PHP, and top frameworks like Laravel and CodeIgniter. Skilled in creating secure, scalable, and SEO-optimized websites, with a focus on responsive design and performance." },
    { name: "keywords", content: "Programmer Analyst, Full-Stack Web & App Developer, Software Engineer, ReactJS, VueJS, AngularJS, NodeJS, PHP, Laravel, CodeIgniter, AngularJS, VueJS, JQuery, HTML, CSS, Web Development, SEO, WordPress, Drupal, Joomla, Custom Themes, Responsive Design, OOP, Web Security, Scalable Websites, MySQL, Linux Development, CMS" },
    { property: "og:locale", content: "en_US" },
    { property: "og:type", content: "portfolio" },
    { property: "og:title", content: "Programmer Analyst | Full-Stack Web & App Developer | Software Engineer | 12+ Years of Experience" },
    { name: "twitter:title", content: "Programmer Analyst | Full-Stack Web & App Developer | Software Engineer | 12+ Years of Experience" },
    { property: "og:description", content: "Experienced Programmer Analyst | Full-Stack Web & App Developer | Software Engineer with 12+ years of expertise in ReactJS, NodeJS, PHP, and top frameworks like Laravel and CodeIgniter. Skilled in creating secure, scalable, and SEO-optimized websites, with a focus on responsive design and performance." },
    { name: "twitter:description", content: "Experienced Programmer Analyst | Full-Stack Web & App Developer | Software Engineer with 12+ years of expertise in ReactJS, NodeJS, PHP, and top frameworks like Laravel and CodeIgniter. Skilled in creating secure, scalable, and SEO-optimized websites, with a focus on responsive design and performance." },
    { property: "og:image", content: "/static/images/profile3.jpg" },
    { name: "twitter:image", content: "/static/images/profile3.jpg" },
    { property: "og:url", content: "https://carlxaeron.github.io/" },
    { property: "og:site_name", content: "Carl Louis Manuel - Programmer Analyst | Full-Stack Web & App Developer | Software Engineer | 12+ Years of Experience" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@carlxaeron09" },
    { name: "twitter:creator", content: "@carlxaeron09" },
  ],
  link: [
    { rel: "canonical", href: "https://carlxaeron.github.io" },
    { rel: "sitemap", type: "application/xml", title: "Sitemap", href: "/sitemap.xml" },
    { rel: "manifest", href: "/manifest.json" },
    { rel: "stylesheet", href: "/static/css/main.de26213c.css" },
  ],
  script: [
    { defer: true, src: "/static/js/main.933fa6e9.js" },
  ],
};

module.exports = {
  SKILLS,
  PROJECT_DESCRIPTION,
  PROJECT_DESCRIPTION2,
  COMPANIES,
  EXPERIENCES,
  HEADERCONFIG,
}