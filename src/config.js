import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, logEvent as LE } from 'firebase/analytics';
import * as conf from './external-config';
import styled from 'styled-components';

export const SKILLS = conf.SKILLS;

export const PROJECT_DESCRIPTION = conf.PROJECT_DESCRIPTION

const LiParent = styled.li`
  margin-bottom: 1rem;
  li {
    margin-left: 1.25rem;
    list-style-type: disc;
  }
`;

export const PROJECTS_DESCRIPTION_AI = (data) => (
  <div className='m-4 text-sm lg:text-lg text-left'>
    <ul>
      <LiParent>Hi! I have 12 years ({data.time}) experience (and still counting) as a full-stack web developer, building web applications and websites that are robust and responsive. I have been experimenting with all sorts of technology, modern to old, since I began in 2012, to come up with solutions that are secure, fault-tolerant, user-centric, and scalable.</LiParent>
      <LiParent>
        <b>My Expertise:</b>
        <ul>
          <li>Front-End Development: I use HTML, CSS, JavaScript frameworks - JQuery, AngularJS, ReactJS, and VueJS - to create interfaces that reflect visually appealing and user-friendly experiences.</li>
          <li>Back-End Mastery: Well versed in PHP/MySQL environments (XAMPP, WAMP, LAMP) and frameworks like Laravel, CodeIgniter, and Zend.</li>
          <li>CMS: From starting with WordPress and Drupal or going all the way to Joomla, I'm an expert in creating and optimizing themes for high performance and SEO.</li>
        </ul>
      </LiParent>
      <LiParent>
        <b>What Makes Me Different:</b>
        <ul>
          <li>I combine my technical expertise with a commitment to provide high-performing applications that are entirely secure. Adhering to Object-Oriented principles, techniques, and modern coding standards applicable to my projects result in airtight projects against varying vulnerabilities like SQL injections.</li>
          <li>At the same time, I'm a user experience advocate. To create sites, it must be mobile-friendly, responsive, and all standard modern browsers compatible. And when it comes to problem-solving I'm an upfront'll face it type of person. I would always throw innovative and creative approaches to it.</li>
        </ul>
      </LiParent>
      <LiParent>
        <b>Beyond Coding:</b>
        <ul>
          <li>SEO Development: Making websites for traffic generation through search engine optimization for businesses.</li>
          <li>Mobile Development: Fluency in Flutter, back ending Firebase integration, functioning as one, making a smooth experience.</li>
          <li>Ongoing Maintenance: Trusted and provided to ensure that projects run smoothly and easily over a long time.</li>
        </ul>
      </LiParent>
      <LiParent>
        <b>Always Evolving:</b>
        <ul>
          <li>In fact, the never-ending endeavor for me is to keep up with the industry trends. Learning, growing, exploring new technologies in order to keep bringing original ideas and innovative groundbreaking solutions.</li>
        </ul>
      </LiParent>
      <LiParent>If you are searching for an imaginative detail-oriented developer who is as much passionate about delivery as you are in making it happen, then we really ought to get in touch because it would be amazing helping you turn your digital dream into a reality!</LiParent>
    </ul>
  </div>
);

export const PROJECTS_DESCRIPTION_AI3 = (data) => <div className='m-4 text-sm lg:text-lg text-left'>
  <ul>
    <li className='mb-2'>I am a passionate Full-Stack Web Developer with over {data.time} experience delivering robust web applications and responsive websites since 2012. My expertise spans a wide range of modern technologies, enabling me to create solutions that are secure, scalable, and user-focused.</li>
    <li className='mb-2'><b>🔑 Core Expertise:</b>
      <ul className='ml-4'>
        <li className='list-disc'>Proficient in front-end development using HTML, CSS, and modern JavaScript frameworks like AngularJS, VueJS, ReactJS, and jQuery.</li>
        <li className='list-disc'>Advanced backend skills with PHP/MySQL ecosystems (XAMPP, WAMP, LAMP) and frameworks like Laravel, CodeIgniter, and Zend.</li>
        <li className='list-disc'>Extensive experience in CMS platforms such as WordPress, Drupal, and Joomla, with a track record of building custom themes and optimizing for SEO.</li>
      </ul>
    </li>
    <li className='mb-2'><b>💡 What Sets Me Apart:</b>
      <ul className='ml-4'>
        <li className='list-disc'>I follow Object-Oriented Programming principles and adhere to the latest coding standards, ensuring secure and resilient applications against vulnerabilities like SQL injections.</li>
        <li className='list-disc'>Strong problem-solving and analytical skills, enabling me to deliver innovative solutions to complex technical challenges.</li>
        <li className='list-disc'>Commitment to seamless user experiences with responsive web designs optimized for cross-browser and mobile compatibility.</li>
      </ul>
    </li>
    <li className='mb-2'><b>📈 Beyond Development:</b>
      <ul className='ml-4'>
        <li className='list-disc'>Skilled in creating SEO-friendly websites that enhance search engine visibility and drive user engagement.</li>
        <li className='list-disc'>Experience in mobile development using Flutter and integrating backend solutions with Firebase.</li>
        <li className='list-disc'>Proficient in providing maintenance and support for ongoing projects, ensuring they remain efficient, reliable, and up to date.</li>
      </ul>
    </li>
    <li className='mb-2'><b>💻 On the Cutting Edge:</b>
      <ul className='ml-4'>
        <li className='list-disc'>I stay ahead of industry trends, constantly refining my skill set to meet market demands. My dedication to professional growth and collaboration fuels my ability to bring innovative ideas to life.</li>
      </ul>
    </li>
    <li>I am excited to connect with like-minded professionals and organizations seeking a creative, detail-oriented, and results-driven developer to transform digital visions into reality.</li>
  </ul>
</div>

export const PROJECTS_DESCRIPTION_AI2 = (data) => <>
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