import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent as LE } from 'firebase/analytics';
import * as conf from './external-config';

export const SKILLS = conf.SKILLS;

export const PROJECT_DESCRIPTION = conf.PROJECT_DESCRIPTION
export const PROJECTS_DESCRIPTION_AI = (data) => <>
  <br />
  <p> With over {data.time} of experience in full - stack web development,
  I specialize in building secure, scalable websites using HTML, CSS, JavaScript(ReactJS, AngularJS, VueJS, JQuery), PHP / MySQL, and NodeJS.I work with top frameworks like Laravel, CodeIgniter, and Zend, ensuring that all code is up - to - date, secure, and optimized
for performance. </p> 
  <p> I am skilled in both Linux and local development environments, with a focus on OOP principles, SQL injection prevention, and high analytical problem - solving.My experience extends to CMS platforms like WordPress, Drupal, and Joomla, with custom theme development and SEO optimization to improve search visibility. </p>
  <p> I continuously adopt the latest technologies to create responsive, cross - browser web designs that work seamlessly across all devices. </p>
</>

export const COMPANIES = conf.COMPANIES;

export const EXPERIENCES = conf.EXPERIENCES;

// FIREBASE CONFIG
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
export const fb_app = initializeApp(firebaseConfig);
export const analytics = getAnalytics (fb_app);
const logEvent = ({ anal, event, option = {} }) => {
    if (process.env.NODE_ENV !== 'development') LE(anal || analytics, event, option);
};
logEvent({event: 'init_app'});
export const fb_db = getFirestore(fb_app);
export { logEvent };