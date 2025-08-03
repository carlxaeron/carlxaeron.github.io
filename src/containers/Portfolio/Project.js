import { useState } from "react";
import Tracker from "../../components/Tracker";
import { analytics, COMPANIES, logEvent } from "../../config";
import { useSpring, animated } from "@react-spring/web";
import { useStore } from "./theme-provider";
import styled from "styled-components";

function PortfolioProject(props) {
  const [show, setShow] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const springs2 = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: show ? 1 : 0, transform: `scale(${show ? '1' : '0.8'})` },
    delay: 100,
  })
  const springs = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: showSkills ? 1 : 0, transform: `scale(${showSkills ? '1' : '0.8'})` },
    delay: 100,
  })

  return (
    <Tracker id={`projectstop`}
      set={0.1}
      onSuccess={() => setShow(true)}
    // onFail={() => setShow(false)}
    >
      <animated.div style={{ ...springs2 }} className="clm-projects clm-fixed-hc" id={`projects${props.id}`}>
        <div className="clm-inner-container clm-container">
          <div className="clm-title">
            <h4>PROJECTS</h4>
          </div>
          <div className="clm-p-btns">
            <Tracker id='proj-comps'
              set={0.1}
              onSuccess={() => setShowSkills(true)}
            // onFail={() => setShowSkills(false)}
            >
              <ul className="row">
                {COMPANIES.map((v, k) => <li style={{ ...springs }} key={k} className="col"><a className="btn btn-primary" href="#">{v.title}.</a></li>)}
                <li style={{ ...springs }} className="col"><a className="btn btn-primary" href="#">Show All </a></li>
              </ul>
            </Tracker>
          </div>
          <div className="clm-p-sites">
            <ul className="row">
              {COMPANIES.map((company, k) => {
                return company.projects?.map((project, k2) => {
                  const imgType = project.imgType || 'jpg';
                  // const img = `/static/images/sites/${project.id}.${imgType}`;
                  // const origImg = `/static/images/sites/${project.id}.${imgType}`;
                  const resizedImg = `/static/images/sites/resized-images/${project.id}.${imgType}`;
                  const img = resizedImg;
                  const key = `${k}_${k2}`;
                  return <LiComponent key={key} id={key} company={company} project={project} img={img} imgType={imgType} />
                })
              })
              }

            </ul>
          </div>
        </div>
      </animated.div>

    </Tracker>
  )
}

export default PortfolioProject;

const compileValue = (value) => {
  const img = `/static/images/sites/${value.project.id}.${value.project.imgType || 'jpg'}`;
  return <div className="row">
    <div className={`${value.html && 'col-md-7'}`}>
      <a href={img} target="_blank" rel="noreferrer">
        <img className="clm-img" src={img} alt={value.alt || img} />
      </a>
    </div>
    {value.html && <div className="col-md-5 clm-modal-details">{value.html}</div>}
  </div>;
}

const H5 = styled.h5`
  margin-top: 1rem;
  font-weight: bold;
`;

const getContents = (props) => {

  let content = false;
  if (props) switch (props.project.id) {
    case 'mb1':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        {/* <p>I have started the feature for MB AppKey in the frontend where i setup the module for appkey that contains the redux, unit test, view, and sub components. After building the core for AppKey, many developers starts to integrate it to different pages/module by just adding a maximum of 5 lines of code to their tasks. It minimizes the repetetive codes and able to maintain easily by updating its core for the frontend.</p> */}
        <p>The MB AppKey feature front-end development spearheaded by me was all about laying down the groundwork for the initial module, including the design and full implementation of an entire base plan. Redux integration, unit tests, views, and subcomponents created an army of a solid and reusable backbone. Once the core part was finished, it could be integrated easily by other developers across pages and even modules without much fuss-usually in less than five lines of code. This proved to be an effortless repetitive coding and easy maintenance, where updates to the core are automatically propagated throughout the entire application.</p>
        <a href="/static/images/sites/mb2.png" target="_blank"><img src="/static/images/sites/resized-images/mb2.png" alt="mb2.png" /></a>
        <a href="/static/images/sites/mb3.png" target="_blank"><img src="/static/images/sites/resized-images/mb3.png" alt="mb3.png" /></a>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#reactJS</li>
          <li>#redux</li>
          <li>#frontend</li>
          <li>#unittesting</li>
          <li>#API</li>
          <li>#html</li>
          <li>#css</li>

        </ul></>)
      });
      break;
    case 'eco':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
          <p>Made in wordpress and woocommerce plugin. My job is to maintain the codes, enhance, debug the site. Make a custom plugin to work in woocommerce and additional features. Fix different bugs on design/layout. Fix website to make it more SEO friendly.</p>
          <H5>Tags</H5>
          <ul className="clm-modal-tools row">
            <li>#wordpress</li>
            <li>#woocommerce</li>
            <li>#php</li>
            <li>#html</li>
            <li>#css</li>
            <li>#js</li>
            <li>#jquery</li>
            <li>#pug</li>
            <li>#nodejs</li>
            <li>#seo</li>
            <li>#debug</li>
            <li>#enhancement</li>
            <li>#sass</li>
            <li>#jquery</li>
            <li>#jade</li>
            <li>#plugin</li>
            <li>#wordpressplugin</li>
            <li>#admin</li>
            <li>#mobileresponsive</li>
            <li>#angularjs</li>
          </ul></>)
      });
      break;
    case 'omniscius':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Omniscius is a comprehensive cybersecurity intelligence platform designed to monitor ransomware groups, track data breaches, and gather intelligence from dark web forums and marketplaces. The platform provides a complete view of the threat landscape, helping organizations stay ahead of cyber threats.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Ransomware Tracking: Monitor active ransomware groups, their victims, and attack patterns</li>
          <li>Credential Monitoring: Identify compromised credentials and data from Infostealer malware</li>
          <li>Forum Intelligence: Track underground forums and marketplaces for threat intelligence</li>
          <li>Early Warning System: Receive alerts about potential threats before they impact your organization</li>
          <li>Global Threat Landscape: Access comprehensive data on cyber threats worldwide</li>
          <li>Threat Actor Profiles: Detailed information about known threat actors and their tactics</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#cybersecurity</li>
          <li>#threatintelligence</li>
          <li>#darkweb</li>
          <li>#ransomware</li>
          <li>#databreaches</li>
          <li>#securityplatform</li>
          <li>#monitoring</li>
          <li>#intelligence</li>
          <li>#nextjs</li>
          <li>#tailwindcss</li>
          <li>#typescript</li>
          <li>#reactjs</li>
          <li>#redux</li>
          <li>#nodejs</li>
          <li>#expressjs</li>
        </ul></>)
      });
      break;
    case 'agent':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Modernized the entire Agent Web Application for GoAutoDial Inc, transforming it from a jQuery and PHP-based system to a modern, scalable application. The project involved complete rewrite with Laravel backend and ReactJS frontend to create a more efficient and user-friendly interface for call center agents.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Complete system modernization from jQuery/PHP to Laravel/ReactJS</li>
          <li>Responsive design optimized for call center agent workflows</li>
          <li>Enhanced performance and scalability for high-load operations</li>
          <li>WHMCS provisioning module for cloud service management</li>
          <li>Improved user experience and productivity for daily operations</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#laravel</li>
          <li>#reactjs</li>
          <li>#php</li>
          <li>#whmcs</li>
          <li>#modernization</li>
          <li>#callcenter</li>
          <li>#responsive</li>
          <li>#scalable</li>
        </ul></>)
      });
      break;
    case 'sc':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Developed the Star Cinema website for ABS-CBN Corp, creating a comprehensive movie booking and information platform. The site features movie listings, showtimes, ticket booking functionality, and promotional content management.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Movie booking system with real-time availability</li>
          <li>Responsive design for mobile and desktop users</li>
          <li>Content management for movie listings and promotions</li>
          <li>SEO optimization for better search visibility</li>
          <li>Cross-browser compatibility and performance optimization</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#jquery</li>
          <li>#responsive</li>
          <li>#booking</li>
          <li>#seo</li>
          <li>#crossbrowser</li>
        </ul></>)
      });
      break;
    case 'kty':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Built the "Kapamilya Thank You" platform for ABS-CBN Corp, a special promotional website designed to engage viewers and provide exclusive content and rewards for loyal Kapamilya members.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Interactive promotional campaigns and rewards system</li>
          <li>User engagement features and loyalty programs</li>
          <li>Responsive design for all device types</li>
          <li>Integration with ABS-CBN's content management system</li>
          <li>Performance optimization for high traffic periods</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#jquery</li>
          <li>#promotional</li>
          <li>#engagement</li>
          <li>#responsive</li>
          <li>#optimization</li>
        </ul></>)
      });
      break;
    case 'push':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Redesigned and developed the Push website for ABS-CBN Corp, creating a modern entertainment news platform with improved user experience and content delivery. The redesign focused on better navigation and content organization.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Complete website redesign with modern UI/UX</li>
          <li>Improved content organization and navigation</li>
          <li>Enhanced mobile responsiveness and performance</li>
          <li>Better SEO optimization for entertainment content</li>
          <li>Integration with ABS-CBN's content management systems</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#redesign</li>
          <li>#uiux</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#seo</li>
          <li>#entertainment</li>
        </ul></>)
      });
      break;
    case 'corp':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Developed the Corporate website for ABS-CBN Corp, creating a professional business platform that showcases the company's corporate information, investor relations, and business services.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Professional corporate website with business information</li>
          <li>Investor relations and corporate governance sections</li>
          <li>Responsive design for professional presentation</li>
          <li>Content management for corporate updates</li>
          <li>SEO optimization for business visibility</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#corporate</li>
          <li>#business</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#seo</li>
          <li>#professional</li>
        </ul></>)
      });
      break;
    case 'careers':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Built the Careers website for ABS-CBN Corp, creating a comprehensive job portal for the company's recruitment needs. The platform features job listings, application forms, and career information.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Job portal with listing and application functionality</li>
          <li>Career information and company culture sections</li>
          <li>Responsive design for job seekers</li>
          <li>Integration with HR systems and processes</li>
          <li>SEO optimization for recruitment visibility</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#careers</li>
          <li>#jobportal</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#recruitment</li>
          <li>#seo</li>
        </ul></>)
      });
      break;
    case 'anc':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Developed the ANC Form system for ABS-CBN Corp, creating a comprehensive form management platform for the news organization's various data collection and submission needs.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Form management system for data collection</li>
          <li>User-friendly interface for form submissions</li>
          <li>Data validation and processing capabilities</li>
          <li>Responsive design for mobile form access</li>
          <li>Integration with news organization workflows</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#forms</li>
          <li>#datacollection</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#validation</li>
          <li>#responsive</li>
          <li>#news</li>
        </ul></>)
      });
      break;
    case 'kaiaq':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Created the KAIAQ Admin Template for ABS-CBN Corp, developing a comprehensive administrative interface template that can be used across various internal systems and applications.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Reusable admin template for internal systems</li>
          <li>Consistent UI/UX across administrative interfaces</li>
          <li>Modular design for easy customization</li>
          <li>Responsive layout for various screen sizes</li>
          <li>Integration with ABS-CBN's design standards</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#admin</li>
          <li>#template</li>
          <li>#uiux</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#modular</li>
        </ul></>)
      });
      break;
    case 'coll8or':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Developed the Coll8or project for Huxxer Corp, creating a collaborative platform that enables team members to work together efficiently on various projects and tasks.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Team collaboration and project management tools</li>
          <li>Real-time communication and file sharing</li>
          <li>Task tracking and progress monitoring</li>
          <li>Responsive design for team accessibility</li>
          <li>Integration with existing workflow systems</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#collaboration</li>
          <li>#teamwork</li>
          <li>#projectmanagement</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#realtime</li>
        </ul></>)
      });
      break;
    case 'kinkcakes':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Built the Kinkcakes website for Huxxer Corp, creating an e-commerce platform for a bakery business with online ordering, product catalog, and customer management features.</p>
        <H5>Key Features</H5>
        <ul>
          <li>E-commerce platform for bakery products</li>
          <li>Online ordering and payment processing</li>
          <li>Product catalog with detailed descriptions</li>
          <li>Customer account management</li>
          <li>Responsive design for mobile shopping</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#ecommerce</li>
          <li>#bakery</li>
          <li>#onlineordering</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#payment</li>
        </ul></>)
      });
      break;
    case 'zmr':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Developed the ZMR project for Zeno Group Investments Inc, creating a comprehensive financial management and investment tracking platform for the company's portfolio management needs.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Portfolio management and investment tracking</li>
          <li>Financial data visualization and reporting</li>
          <li>Real-time market data integration</li>
          <li>Secure user authentication and data protection</li>
          <li>Responsive design for financial professionals</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#finance</li>
          <li>#investment</li>
          <li>#portfolio</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#security</li>
        </ul></>)
      });
      break;
    case 'zbceuit':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Built the ZBCEUIT project for Zeno Group Investments Inc, creating an educational technology platform that provides learning management and course delivery capabilities.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Learning management system (LMS) functionality</li>
          <li>Course creation and content delivery</li>
          <li>Student progress tracking and assessment</li>
          <li>Interactive learning tools and resources</li>
          <li>Responsive design for educational access</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#education</li>
          <li>#lms</li>
          <li>#elearning</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#interactive</li>
        </ul></>)
      });
      break;
    case 'zgi':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Developed the ZGI project for Zeno Group Investments Inc, creating a comprehensive business intelligence and analytics platform for data-driven decision making.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Business intelligence and analytics dashboard</li>
          <li>Data visualization and reporting tools</li>
          <li>Real-time data processing and analysis</li>
          <li>Customizable dashboards and metrics</li>
          <li>Responsive design for business users</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#analytics</li>
          <li>#businessintelligence</li>
          <li>#dashboard</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#visualization</li>
        </ul></>)
      });
      break;
    case 'vigattintourism':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Developed the Vigattin Tourism website for Vigattin Inc, creating a comprehensive travel and tourism platform that showcases destinations, travel packages, and booking services.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Tourism destination showcase and information</li>
          <li>Travel package booking and reservation system</li>
          <li>Interactive maps and destination guides</li>
          <li>Customer reviews and ratings system</li>
          <li>Responsive design for travelers on mobile devices</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#tourism</li>
          <li>#travel</li>
          <li>#booking</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#maps</li>
        </ul></>)
      });
      break;
    case 'vigattindeals':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Built the Vigattin Deals platform for Vigattin Inc, creating a deals and promotions website that offers special discounts, offers, and promotional campaigns for various products and services.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Deals and promotions management system</li>
          <li>Special offers and discount tracking</li>
          <li>User registration and deal claiming</li>
          <li>Promotional campaign management</li>
          <li>Responsive design for deal hunters</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#deals</li>
          <li>#promotions</li>
          <li>#discounts</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#campaigns</li>
        </ul></>)
      });
      break;
    case 'vigattintrade':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Developed the Vigattin Trade platform for Vigattin Inc, creating a marketplace similar to OLX where users can buy and sell various products and services.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Buy and sell marketplace functionality</li>
          <li>Product listing and search capabilities</li>
          <li>User authentication and profile management</li>
          <li>Messaging system between buyers and sellers</li>
          <li>Responsive design for marketplace users</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#marketplace</li>
          <li>#buyandsell</li>
          <li>#olx</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#messaging</li>
        </ul></>)
      });
      break;
    case 'vigattin':
      content = compileValue({
        ...props,
        html: (<><H5>Description</H5>
        <p>Developed the main Vigattin website for Vigattin Inc, creating the primary platform that serves as the central hub for all Vigattin services and business operations.</p>
        <H5>Key Features</H5>
        <ul>
          <li>Main corporate website and service hub</li>
          <li>Company information and service overview</li>
          <li>Integration with all Vigattin sub-platforms</li>
          <li>Professional business presentation</li>
          <li>Responsive design for all users</li>
        </ul>
        <H5>Tags</H5>
        <ul className="clm-modal-tools row">
          <li>#corporate</li>
          <li>#mainwebsite</li>
          <li>#business</li>
          <li>#html</li>
          <li>#css</li>
          <li>#javascript</li>
          <li>#responsive</li>
          <li>#professional</li>
        </ul></>)
      });
      break;
    default:
      content = compileValue({
        ...props, html: false
      });
      break;
  };

  // Log the event
  if (content) logEvent({ event: 'view_project', option: { item_id: props.project.id, item_name: props.project.title } });

return content;
}

const LiComponent = (props) => {
  const { company, project, img, imgType, id } = props;
  const { setValue } = useStore();
  const handleClickCompany = (e) => {
    if (getContents(props)) setValue({
      modal: {
        show: true,
        body: getContents(props),
        title: `${company.title}${project.title ? ` - ${project.title}` : ''}`,
        config: {
          fullscreen: value.width > 1000 ? false : true,
          size: value.width > 1000 ? 'xl' : false,
        }
      }
    });
  }

  const { value } = useStore();
  const [show, setShow] = useState(false);
  const idKey = `li-component-${id}`;

  const springs = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: show ? 1 : 0, transform: `scale(${show ? '1' : '0.8'})` },
    delay: 100,
  })

  return (
    <Tracker id={idKey}
      set={value.isMobile ? 0.01 : 0.1}
      onSuccess={() => setShow(true)}
    // onFail={() => setShow(false)}
    >
      <animated.li id={idKey} style={{ ...springs }} className='col-lg-4 col-6 col-xl-3'>
        {project.id && (
          <div onClick={e => handleClickCompany(e, props)} className="cursor-pointer clm-p-s-cont shadow" style={{ backgroundImage: `url("${img}")` }}>
            <img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src={`${img}`} alt={`${project.id}.${imgType}`} />
          </div>
        )}
        {!project.id && (
          <div className="clm-p-s-cont shadow">
            <h5>No Preview</h5>
          </div>
        )}
      </animated.li>
    </Tracker>
  )
}

const skillsBak = (<>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-ecoshift">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/eco.jpg")' }}>
      <img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/eco.jpg" alt="eco.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-ecoshift" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Ecoshift Corp. - Ecoshift</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/eco.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/eco.jpg" alt="eco.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made in wordpress and woocommerce plugin. My job is to maintain the codes, enhance, debug the site. Make a custom plugin to work in woocommerce and additional features. Fix different bugs on design/layout. Fix website to make it more SEO friendly.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#wordpress</li>
                  <li>#woocommerce</li>
                  <li>#php</li>
                  <li>#html</li>
                  <li>#css</li>
                  <li>#js</li>
                  <li>#jquery</li>
                  <li>#pug</li>
                  <li>#nodejs</li>
                  <li>#seo</li>
                  <li>#debug</li>
                  <li>#enhancement</li>
                  <li>#sass</li>
                  <li>#jquery</li>
                  <li>#jade</li>
                  <li>#plugin</li>
                  <li>#wordpressplugin</li>
                  <li>#admin</li>
                  <li>#mobileresponsive</li>
                  <li>#angularjs</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.ecoshiftcorp.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-starcinema">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/sc.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/sc.jpg" alt="sc.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-starcinema" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">ABS-CBN Corp. - Star Cinema</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/sc.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/sc.jpg" alt="sc.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made in .net system (kentico). Redesign the old layout from scratch from PSD Layout to HTML,CSS,JS. Make it friendly site to desktop and mobile.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#html</li>
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#pug</li>
                  <li>#jade</li>
                  <li>#psdtohtml</li>
                  <li>#bootstrap</li>
                  <li>#mobileresponsive</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://starcinema.abs-cbn.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-kapamilyathankyou">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/kty.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/kty.png" alt="kty.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-kapamilyathankyou" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">ABS-CBN Corp. - Kapamilya Thank You</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/kty.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/kty.png" alt="kty.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made in .net system (kentico). Redesign the old layout from scratch from PSD Layout to HTML,CSS,JS. Make it friendly site to desktop and mobile.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#html</li>
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#pug</li>
                  <li>#jade</li>
                  <li>#psdtohtml</li>
                  <li>#angular</li>
                  <li>#mobileresponsive</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://thankyou.abs-cbn.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-push">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/push.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/push.jpg" alt="push.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-push" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">ABS-CBN Corp. - Push Redesign</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/push.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/push.jpg" alt="push.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made in .net system (kentico). Redesign the old layout from scratch from PSD Layout to HTML,CSS,JS. Make it friendly site to desktop and mobile.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#html</li>
                  <li>#psdtohtml</li>
                  <li>#pug</li>
                  <li>#jade</li>
                  <li>#nodejs</li>
                  <li>#debug</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#socialmedia</li>
                  <li>#seo</li>
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#mobileresponsive</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://push.abs-cbn.com" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-corporate">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/corp.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/corp.png" alt="corp.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-corporate" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">ABS-CBN Corp. - Corporate</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/corp.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/corp.png" alt="corp.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Enhance the website.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#html</li>
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#pug</li>
                  <li>#jade</li>
                  <li>#psdtohtml</li>
                  <li>#mobileresponsive</li>
                  <li>#enhancement</li>
                  <li>#debug</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.abs-cbn.com/corporate" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-careers">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/careers.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/careers.png" alt="careers.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-careers" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">ABS-CBN Corp. - Careers</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/careers.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/careers.png" alt="careers.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Enhance the careers website.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#html</li>
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#pug</li>
                  <li>#jade</li>
                  <li>#psdtohtml</li>
                  <li>#enhancement</li>
                  <li>#debug</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://careers.abs-cbn.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-anc">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/anc.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/anc.png" alt="anc.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-anc" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">ABS-CBN Corp. - ANC Form</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/anc.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/anc.png" alt="anc.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>ANC Form for 1 week event.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#html</li>
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#pug</li>
                  <li>#jade</li>
                  <li>#psdtohtml</li>
                  <li>#enhancement</li>
                  <li>#debug</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-kaiaq-admin">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/kaiaq.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/kaiaq.png" alt="kaiaq.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-kaiaq-admin" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">ABS-CBN Corp. - KAIAQ Admin Template</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/kaiaq.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/kaiaq.png" alt="kaiaq.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>KAIAQ Admin Template to be use.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#html</li>
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#pug</li>
                  <li>#jade</li>
                  <li>#psdtohtml</li>
                  <li>#enhancement</li>
                  <li>#debug</li>
                  <li>#bootstrap</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-asphaltnitro">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/asphaltnitro.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/asphaltnitro.jpg" alt="asphaltnitro.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-asphaltnitro" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - Asphalt Nitro</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/asphaltnitro.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/asphaltnitro.jpg" alt="asphaltnitro.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made it from scratch and from PSD Layout to HTML,CSS,JS. Friendly website from desktop to mobile and created a codeigniter system to make the repeatable codes in one for all the gamelofts 1 pager sites</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#html</li>
                  <li>#php</li>
                  <li>#debug</li>
                  <li>#mobileresponsive</li>
                  <li>#css</li>
                  <li>#less</li>
                  <li>#nodejs</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.gameloft.com/en/game/asphalt-nitro-mobile" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-asphalt8">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/asphalt8.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/asphalt8.jpg" alt="asphalt8.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-asphalt8" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - Asphalt 8</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/asphalt8.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/asphalt8.jpg" alt="asphalt8.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made it from scratch and from PSD Layout to HTML,CSS,JS. Friendly website from desktop to mobile and created a codeigniter system to make the repeatable codes in one for all the gamelofts 1 pager sites</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#html</li>
                  <li>#php</li>
                  <li>#debug</li>
                  <li>#mobileresponsive</li>
                  <li>#css</li>
                  <li>#less</li>
                  <li>#nodejs</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.gameloft.com/asphalt8/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-gameloft-customercare">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/cc.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/cc.jpg" alt="cc.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-gameloft-customercare" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - Customer Care</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/cc.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/cc.jpg" alt="cc.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Enhance the site and fixed the problem from PHP, HTML, CSS, JS.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#debug</li>
                  <li>#enhancement</li>
                  <li>#php</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://support.gameloft.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-despicableme">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/dm.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/dm.png" alt="dm.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-despicableme" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - Despicable Me</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/dm.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/dm.png" alt="dm.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made it from scratch and from PSD Layout to HTML,CSS,JS. Friendly website from desktop to mobile and created a codeigniter system to make the repeatable codes in one for all the gamelofts 1 pager sites</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#html</li>
                  <li>#php</li>
                  <li>#debug</li>
                  <li>#mobileresponsive</li>
                  <li>#css</li>
                  <li>#less</li>
                  <li>#nodejs</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://minionrush.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-dungeonhunter5">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/dh5.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/dh5.jpg" alt="dh5.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-dungeonhunter5" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - Dungeon Hunter V</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/dh5.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/dh5.jpg" alt="dh5.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made it from scratch and from PSD Layout to HTML,CSS,JS. Friendly website from desktop to mobile and created a codeigniter system to make the repeatable codes in one for all the gamelofts 1 pager sites</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#html</li>
                  <li>#php</li>
                  <li>#debug</li>
                  <li>#mobileresponsive</li>
                  <li>#css</li>
                  <li>#less</li>
                  <li>#nodejs</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="http://dungeonhunter5.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-gameloft-forum">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/gl-forum.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/gl-forum.jpg" alt="gl-forum.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-gameloft-forum" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - Forum</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/gl-forum.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/gl-forum.jpg" alt="gl-forum.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Enhance the site and fixed the problem from PHP, HTML, CSS, JS.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#debug</li>
                  <li>#enhancement</li>
                  <li>#php</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://forum.gameloft.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-gods-of-rome-game">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/gor.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/gor.jpg" alt="gor.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-gods-of-rome-game" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - Gods Of Rome Game</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/gor.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/gor.jpg" alt="gor.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made it from scratch and from PSD Layout to HTML,CSS,JS. Friendly website from desktop to mobile and created a codeigniter system to make the repeatable codes in one for all the gamelofts 1 pager sites</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#html</li>
                  <li>#php</li>
                  <li>#debug</li>
                  <li>#mobileresponsive</li>
                  <li>#css</li>
                  <li>#less</li>
                  <li>#nodejs</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.gameloft.com/en/game/gods-of-rome" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-heroes-of-order-and-chaos">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/hoc.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/hoc.png" alt="hoc.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-heroes-of-order-and-chaos" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - Heroes of Order and Chaos</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/hoc.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/hoc.png" alt="hoc.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made it from scratch and from PSD Layout to HTML,CSS,JS. Friendly website from desktop to mobile and created a codeigniter system to make the repeatable codes in one for all the gamelofts 1 pager sites</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#html</li>
                  <li>#php</li>
                  <li>#debug</li>
                  <li>#mobileresponsive</li>
                  <li>#css</li>
                  <li>#less</li>
                  <li>#nodejs</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="http://www.heroesoforderandchaosgame.com/index.php" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-sniper-fury">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/sf.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/sf.jpg" alt="sf.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-sniper-fury" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - Sniper Fury</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/sf.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/sf.jpg" alt="sf.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made it from scratch and from PSD Layout to HTML,CSS,JS. Friendly website from desktop to mobile and created a codeigniter system to make the repeatable codes in one for all the gamelofts 1 pager sites</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#html</li>
                  <li>#php</li>
                  <li>#debug</li>
                  <li>#mobileresponsive</li>
                  <li>#css</li>
                  <li>#less</li>
                  <li>#nodejs</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.sniperfury.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-blacklist">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/tbc.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/tbc.jpg" alt="tbc.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-blacklist" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gameloft Philippines - The Blacklist Conspiracy</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/tbc.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/tbc.jpg" alt="tbc.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Made it from scratch and from PSD Layout to HTML,CSS,JS. Friendly website from desktop to mobile and created a codeigniter system to make the repeatable codes in one for all the gamelofts 1 pager sites.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#html</li>
                  <li>#php</li>
                  <li>#debug</li>
                  <li>#mobileresponsive</li>
                  <li>#css</li>
                  <li>#less</li>
                  <li>#nodejs</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.gameloft.com/en-gb/game/blacklist" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-coll8or">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/coll8or.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/coll8or.png" alt="coll8or.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-coll8or" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Huxxer Corp. - Coll8or</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/coll8or.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/coll8or.png" alt="coll8or.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>All social media in one site by using the social medias API.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#socialmedia</li>
                  <li>#php</li>
                  <li>#codeigniter</li>
                  <li>#debug</li>
                  <li>#html</li>
                  <li>#api</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#css</li>
                  <li>#less</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="http://coll8or.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-kinkcakes">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/kinkcakes.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/kinkcakes.jpg" alt="kinkcakes.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-kinkcakes" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Huxxer Corp. - KinkCakes</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/kinkcakes.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/kinkcakes.jpg" alt="kinkcakes.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>About cakes.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#css</li>
                  <li>#less</li>
                  <li>#psdtohtml</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#debug</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="http://kinkcakes.com.ph/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-zmr">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/zmr.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/zmr.png" alt="zmr.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-zmr" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Zeno Group Investsments Inc. - Zeno Media Release</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/zmr.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/zmr.png" alt="zmr.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>News About Zenos websites and all good works of Zeno Company in every city and country.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#psdtohtml</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#debug</li>
                  <li>#html</li>
                  <li>#wordpress</li>
                  <li>#wordpresstheme</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="http://zenomediarelease.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-zbceuit">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/zbceuit.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/zbceuit.png" alt="zbceuit.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-zbceuit" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Zeno Group Investsments Inc. - Zeno Brothers Construction - Italy</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/zbceuit.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/zbceuit.png" alt="zbceuit.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>About construction on italy-based company.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#psdtohtml</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#debug</li>
                  <li>#html</li>
                  <li>#jade</li>
                  <li>#pug</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="http://zbccostruzioni.it/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-zgi">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/zgi.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/zgi.png" alt="zgi.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-zgi" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Zeno Group Investsments Inc. - Zeno Group Investments</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/zgi.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/zgi.png" alt="zgi.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>About investments and the members of zeno group investments.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#css</li>
                  <li>#sass</li>
                  <li>#psdtohtml</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#debug</li>
                  <li>#html</li>
                  <li>#jade</li>
                  <li>#pug</li>
                  <li>#laravel</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="http://zenogroupinvestments.com/home" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-388a-poker-games">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/undefined")' }}>
      <h5>No Preview</h5>
    </div>
    <div className="modal fade" id="clm-sites-modal-388a-poker-games" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Leekie Enterprises Inc. - 388a Casino Games</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="" alt="" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>About casino games with flash games.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#html</li>
                  <li>#css</li>
                  <li>#jquery</li>
                  <li>#javascript</li>
                  <li>#psdtohtml</li>
                  <li>#debug</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.sbobet.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-vigattintourism">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/vigattintourism.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/vigattintourism.jpg" alt="vigattintourism.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-vigattintourism" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Vigattin Inc. - Tourism</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/vigattintourism.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/vigattintourism.jpg" alt="vigattintourism.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>Tourism site for the Philippines.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#css</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#debug</li>
                  <li>#test</li>
                  <li>#enhancement</li>
                  <li>#seo</li>
                  <li>#mobileresponsive</li>
                  <li>#less</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.vigattintourism.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-vigattindeals">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/vigattindeals.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/vigattindeals.png" alt="vigattindeals.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-vigattindeals" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Vigattin Inc. - Deals</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/vigattindeals.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/vigattindeals.png" alt="vigattindeals.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>It is about a site with a coupon that can buy with very big discounts.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#css</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#debug</li>
                  <li>#test</li>
                  <li>#paymentapi</li>
                  <li>#enhancement</li>
                  <li>#seo</li>
                  <li>#mobileresponsive</li>
                  <li>#less</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.vigattindeals.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-vigattintrade">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/vigattintrade.png")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/vigattintrade.png" alt="vigattintrade.png" />
    </div>
    <div className="modal fade" id="clm-sites-modal-vigattintrade" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Vigattin Inc. - Trade</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/vigattintrade.png" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/vigattintrade.png" alt="vigattintrade.png" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>It is a trading site like OLX. Buy and Sell Website.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#css</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#debug</li>
                  <li>#test</li>
                  <li>#enhancement</li>
                  <li>#seo</li>
                  <li>#mobileresponsive</li>
                  <li>#less</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.vigattintrade.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
  <li className="col-lg-4 col-6 col-xl-3" role="button" data-toggle="modal" data-target="#clm-sites-modal-vigattin">
    <div className="clm-p-s-cont shadow" style={{ backgroundImage: 'url("/static/images/sites/vigattin.jpg")' }}><img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/vigattin.jpg" alt="vigattin.jpg" />
    </div>
    <div className="modal fade" id="clm-sites-modal-vigattin" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Vigattin Inc. - Vigattin</h5>
            <button className="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7"><a href="/static/images/sites/vigattin.jpg" target="_blank"><img className="clm-img" src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/sites/vigattin.jpg" alt="vigattin.jpg" />
              </a>
              </div>
              <div className="col-md-5 clm-modal-details">
                <h5>Description</h5>
                <p>The main site of all vigattin websites.</p>
                <h5>Tags</h5>
                <ul className="clm-modal-tools row">
                  <li>#codeigniter</li>
                  <li>#psdtohtml</li>
                  <li>#css</li>
                  <li>#javascript</li>
                  <li>#jquery</li>
                  <li>#debug</li>
                  <li>#test</li>
                  <li>#enhancement</li>
                  <li>#seo</li>
                  <li>#mobileresponsive</li>
                  <li>#less</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="modal-footer"><a className="btn btn-primary" href="https://www.vigattin.com/" target="_blank" rel="noreferrer">Website Link</a>
            <button className="btn-info btn" type="button" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </li>
</>)