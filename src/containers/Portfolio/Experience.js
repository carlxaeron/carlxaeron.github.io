import { useSpring, animated } from "@react-spring/web";
import Img from "../../components/Img";
import { useEffect, useState } from "react";
import { useStore } from "./theme-provider";
import Tracker from "../../components/Tracker";
import { EXPERIENCES } from "../../config";

function PortfolioExperience(props) {
  const [show, setShow] = useState(false);
  const { value } = useStore();
  const springs = useSpring({
    from: { opacity: 0},
    to: { opacity: show ? 1 : 0 },
    delay: 100,
  })

  const ExperiencesLi = ({ v, k }) => {
    const [show, setShow] = useState(false);
    const springs = useSpring({
      from: { opacity: 0, transform: 'scale(0.8)' },
      to: { opacity: show ? 1 : 0, transform: `scale(${show ? '1' : '0.8'})` },
    })

    return (
      <animated.li id={`experiences-${props.id}-${k}`} style={props.id === 'bottom' ? {...springs} : {opacity: 0}}  className="row">
        <Tracker id={`experiences-${props.id}-${k}`}
          set={0.05}
          onSuccess={() => setShow(true)}
          onFail={() => setShow(false)}
        >
          <div className="col-sm-3 col-md-2 clm-com-logo clm-com-logo-light">
            <div className="clm-com-logo-cont"><Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src={v.companyLogo} />
            </div>
          </div>
          <div className="col-sm-9 col-md-10">
            <div className="clm-com-title">
              <h4>{v.companyName}</h4><span>
                <h5>(Feb 2019</h5>
                <h5>- Present)</h5></span>
            </div>
            <div className="clm-com-job-title">
              <h4>Web Developer</h4>
            </div>
            <div className="clm-com-detail">
              <p> My job is to maintain the codes, enhance, debug the site. Make a custom plugin to work in woocommerce and additional features. Fix different bugs on design/layout. Fix website to make it more SEO friendly.</p>
            </div>
          </div>
        </Tracker>
      </animated.li>
    )
  }

  return (
    <Tracker id={`experiences-top`}
      set={0.05}
      onSuccess={() => setShow(true)}
      onFail={() => setShow(false)}
    >
      <animated.div style={props.id === 'bottom' ? {...springs} : {opacity: 0}} className="clm-exps clm-fixed-hc bg-white" id={`experiences-${props.id}`}>
        <div className="clm-inner-container clm-container">
          <div className="clm-title">
            <h4>EXPERIENCES</h4>
          </div>
          <ul className="clm-company">
            { 
              EXPERIENCES.map((v, k) => (
                <ExperiencesLi v={v} k={k} key={k} />
              )) }
            {/* <li className="row">
              <div className="col-sm-3 col-md-2 clm-com-logo clm-com-logo-light">
                <div className="clm-com-logo-cont"><Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/companies/eco.jpg" />
                </div>
              </div>
              <div className="col-sm-9 col-md-10">
                <div className="clm-com-title">
                  <h4>Ecoshift Corp.</h4><span>
                    <h5>(Feb 2019</h5>
                    <h5>- Present)</h5></span>
                </div>
                <div className="clm-com-job-title">
                  <h4>Web Developer</h4>
                </div>
                <div className="clm-com-detail">
                  <p> My job is to maintain the codes, enhance, debug the site. Make a custom plugin to work in woocommerce and additional features. Fix different bugs on design/layout. Fix website to make it more SEO friendly.</p>
                </div>
              </div>
            </li> */}
            {/* <li className="row">
              <div className="col-sm-3 col-md-2 clm-com-logo clm-com-logo-light">
                <div className="clm-com-logo-cont"><Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/companies/abscbn.png" />
                </div>
              </div>
              <div className="col-sm-9 col-md-10">
                <div className="clm-com-title">
                  <h4>ABS-CBN Corp.</h4><span>
                    <h5>(Sep 2016</h5>
                    <h5>- Feb 2019)</h5></span>
                </div>
                <div className="clm-com-job-title">
                  <h4>Frontend Developer</h4>
                </div>
                <div className="clm-com-detail">
                  <p>My responsibilities are make webpages that made of HTML, CSS, and JavaScript. By using latest and updated technology and using NPM we build some webpages that is supported the GULP task management. I used LESS, SASS for managing the CSS. I used webpack for compiling and just all the plugins or JavaScript in one file. I used JADE template for building the HTML file. Make the webpage supports all browsers from desktop to mobile devices. I finished three websites from scratch.</p>
                </div>
              </div>
            </li>
            <li className="row">
              <div className="col-sm-3 col-md-2 clm-com-logo clm-com-logo-light">
                <div className="clm-com-logo-cont"><Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/companies/gl.png" />
                </div>
              </div>
              <div className="col-sm-9 col-md-10">
                <div className="clm-com-title">
                  <h4>Gameloft Philippines</h4><span>
                    <h5>(Aug 2015</h5>
                    <h5>- Jul 2016)</h5></span>
                </div>
                <div className="clm-com-job-title">
                  <h4>R&amp;D PHP Developer</h4>
                </div>
                <div className="clm-com-detail">
                  <p>My responsibilities are doing the development for backend of the website after the projects are done from the designer and frontend developer. I'm doing the functionality of the website by using any frameworks. I used the zend framework 2 here and develop the website on cloud9 and in linux environment. I've learned here the zf2 framework, PHP unit testing (PHPUnit, selenium), js unit testing (karma.js, javascript frameworks(jQuery, angular.js), node.js, bower, etc.</p>
                </div>
              </div>
            </li>
            <li className="row">
              <div className="col-sm-3 col-md-2 clm-com-logo clm-com-logo-light">
                <div className="clm-com-logo-cont"><Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/companies/ccs.png" />
                </div>
              </div>
              <div className="col-sm-9 col-md-10">
                <div className="clm-com-title">
                  <h4>ConsumerCloud Services Inc.</h4><span>
                    <h5>(Mar 2015</h5>
                    <h5>- Aug 2015)</h5></span>
                </div>
                <div className="clm-com-job-title">
                  <h4>Senior PHP Developer</h4>
                </div>
                <div className="clm-com-detail">
                  <p>The Australian client has LGS System, this is large system contains large data came from surveys and clients and are paying for every valid data and it is hosted in AWS (Amazon Web Services). My job as senior web developer is to document the system's flow so we can fix anything that needs by client to be fixed and support the junior developer.</p>
                </div>
              </div>
            </li>
            <li className="row">
              <div className="col-sm-3 col-md-2 clm-com-logo clm-com-logo-light">
                <div className="clm-com-logo-cont"><Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/companies/huxxer.png" />
                </div>
              </div>
              <div className="col-sm-9 col-md-10">
                <div className="clm-com-title">
                  <h4>Huxxer Corp.</h4><span>
                    <h5>(Dec 2014</h5>
                    <h5>- Mar 2015)</h5></span>
                </div>
                <div className="clm-com-job-title">
                  <h4>Senior Web Developer</h4>
                </div>
                <div className="clm-com-detail">
                  <p>My responsibilities in one of our became clients are developed the two of the system using the laravel framework owned by one of the Australian client; one is Dontudare.com is about a social app that may post anonymously for the security purposes of the user and one is Coll8or is the social app that consists of many social API in one website. In our local client I developed a cake management web app from not optimized laravel kinkcakes made by last developers to scratch laravel kinkcakes.</p>
                </div>
              </div>
            </li>
            <li className="row">
              <div className="col-sm-3 col-md-2 clm-com-logo clm-com-logo-light">
                <div className="clm-com-logo-cont"><Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/companies/zeno.png" />
                </div>
              </div>
              <div className="col-sm-9 col-md-10">
                <div className="clm-com-title">
                  <h4>Zeno Group Investsments Inc.</h4><span>
                    <h5>(Jul 2014</h5>
                    <h5>- Dec 2014)</h5></span>
                </div>
                <div className="clm-com-job-title">
                  <h4>Web Admin</h4>
                </div>
                <div className="clm-com-detail">
                  <p>My job is to create websites made with wordpress and customized or own themes from my leader or CEO on UK with support from his COO here in the Philippines. I made a 30+ websites from PSD to HTML and from scratch. I used also laravel PHP framework here on websites that dont need to be CMS.</p>
                </div>
              </div>
            </li>
            <li className="row">
              <div className="col-sm-3 col-md-2 clm-com-logo">
                <div className="clm-com-logo-cont"><Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/companies/leekie.jpg" />
                </div>
              </div>
              <div className="col-sm-9 col-md-10">
                <div className="clm-com-title">
                  <h4>Leekie Enterprises Inc.</h4><span>
                    <h5>(Apr 2014</h5>
                    <h5>- Jul 2014)</h5></span>
                </div>
                <div className="clm-com-job-title">
                  <h4>Web Developer</h4>
                </div>
                <div className="clm-com-detail">
                  <p>My responsilities are doing my task as a Web Developer based on the given task to give their expectation for the gaming website. Share ideas what I have learned from the recent work experience. My achievements is to share my ideas/experiences from what I have learned and show them that I am not the ordinary programmer.</p>
                </div>
              </div>
            </li>
            <li className="row">
              <div className="col-sm-3 col-md-2 clm-com-logo clm-com-logo-light">
                <div className="clm-com-logo-cont"><Img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/static/images/companies/vigattin.jpg" />
                </div>
              </div>
              <div className="col-sm-9 col-md-10">
                <div className="clm-com-title">
                  <h4>Vigattin Inc.</h4><span>
                    <h5>(May 2012</h5>
                    <h5>- Apr 2014)</h5></span>
                </div>
                <div className="clm-com-job-title">
                  <h4>Web Developer</h4>
                </div>
                <div className="clm-com-detail">
                  <p>My job is to develop the 4 websites. Web Designing, Coding, Debugging and Web Security. I used CodeIgniter PHP framework here. I made 2 websites here from scratch and I update/enhance other websites here.</p>
                </div>
              </div>
            </li> */}
          </ul>
        </div>
      </animated.div>
    </Tracker>
  )
}

export default PortfolioExperience;