import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";
import { useSpring, animated } from "@react-spring/web";
import Tracker from "./../../components/Tracker";
import { PROJECTS_DESCRIPTION_AI, SKILLS } from "./../../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngular, faBootstrap, faCss3, faFlutter, faGit, faGulp, faHtml5, faJoomla, faJs, faLaravel, faLess, faNode, faNodeJs, faNpm, faPhp, faReact, faVuejs, faWordpress } from '@fortawesome/free-brands-svg-icons';
import { faMobileAlt } from "@fortawesome/free-solid-svg-icons";

function convertDateStringToYears(dateString) {
  // Parse the date string
  const [month, year] = dateString.split(' ');
  const date = new Date(`${month} 1, ${year}`);
  
  // Get the current date
  const currentDate = new Date();
  
  // Calculate the difference in years
  let yearsDifference = currentDate.getFullYear() - date.getFullYear();
  
  // Adjust for the month difference
  const monthsDifference = currentDate.getMonth() - date.getMonth();
  if (monthsDifference < 0 || (monthsDifference === 0 && currentDate.getDate() < date.getDate())) {
    yearsDifference--;
  }
  
  // Calculate the difference in days
  const timeDifference = currentDate - date;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
  // Calculate the difference in hours
  const hoursDifference = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  // Calculate the difference in minutes
  const minutesDifference = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  
  // Calculate the difference in seconds
  const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
  return `${yearsDifference} years (${daysDifference} days ${hoursDifference} hrs ${minutesDifference} mins ${secondsDifference} secs)`;
}

function PortfolioAbout(props) {
  const themeContext = useContext(ThemeContext);
  const [show, setShow] = useState(false);

  const exps = [
    {
      title: 'Title #1',
      yrs: 5,
      percent: 66,
    },
  ];

  const skills = SKILLS;

  const skillsFiltered = () => {
    const s = [];
    let parent = -1;
    skills.forEach((v, k) => {
      v.k = k;
      if (v.parent) {
        s.push(v);
        parent++;
      } else {
        if (!s[parent]?.child) s[parent] = { ...s[parent], child: [] };
        s[parent].child.push(v);
      }
    });
    return s;
  }

  const SkillComponent = ({ skill, i }) => {
    const [show2, setShow2] = useState(false);

    const springs = useSpring({
      from: { width: '0%', },
      to: { width: `${parseInt(show2 ? skill.percentage : 0)}%`, },
      // delay: 50 * parseInt(skill.k),
    })

    const generateTitle = (title) => {
      const t = title.toLowerCase();
      const props = {
        alt: title,
        title,
      }
      let icon = null;

      const FontCompononent = (props) => <FontAwesomeIcon className="text-2xl m-2" {...props} />

      if (t.indexOf('javascript') >= 0) {
        icon = <><FontCompononent {...props} icon={faJs} /></>
      } else if (t.indexOf('reactjs') >= 0) {
        icon = <><FontCompononent {...props} icon={faReact} /> </>
      } else if (t.indexOf('node') >= 0) {
        icon = <><FontCompononent {...props} icon={faNodeJs} /></>
      } else if (t.indexOf('angular') >= 0) {
        icon = <><FontCompononent {...props} icon={faAngular} /></>
      } else if (t.indexOf('vue') >= 0) {
        icon = <><FontCompononent {...props} icon={faVuejs} /></>
      } else if (t.indexOf('mobile') >= 0) {
        icon = <><FontCompononent {...props} icon={faMobileAlt} /></>
      } else if (t.indexOf('flutter') >= 0) {
        icon = <><FontCompononent {...props} icon={faFlutter} /></>
      } else if (t.indexOf('php') >= 0) {
        icon = <><FontCompononent {...props} icon={faPhp} /></>
      } else if (t.indexOf('laravel') >= 0) {
        icon = <><FontCompononent {...props} icon={faLaravel} /></>
      } else if (t.indexOf('wordp') >= 0) {
        icon = <><FontCompononent {...props} icon={faWordpress} /></>
      } else if (t.indexOf('joom') >= 0) {
        icon = <><FontCompononent {...props} icon={faJoomla} /></>
      } else if (t.indexOf('npm') >= 0) {
        icon = <><FontCompononent {...props} icon={faNpm} /></>
      } else if (t.indexOf('gulp') >= 0) {
        icon = <><FontCompononent {...props} icon={faGulp} /></>
      } else if (t.indexOf('less') >= 0) {
        icon = <><FontCompononent {...props} icon={faLess} /></>
      } else if (t.indexOf('css') >= 0) {
        icon = <><FontCompononent {...props} icon={faCss3} /></>
      } else if (t.indexOf('bootstrap') >= 0) {
        icon = <><FontCompononent {...props} icon={faBootstrap} /></>
      } else if (t.indexOf('html') >= 0) {
        icon = <><FontCompononent {...props} icon={faHtml5} /></>
      } else if (t.indexOf('git') >= 0) {
        icon = <><FontCompononent {...props} icon={faGit} /></>
      }

      if (icon) {
        return <>{icon}&nbsp;<i className="!text-[10px]">{
          t
            && t !== 'php'
            && t !== 'npm'
            ? title : ''}</i></>
      } else {
        return title;
      }
    }

    return (
      <Tracker id={`about-top-skill-${i}`}
        set={0.05}
        onSuccess={() => setShow2(true)}
        // onFail={() => setShow2(false)}
      >
      <li key={i}>
        <h5 className="!text-[0.9rem]">{generateTitle(skill.name)}</h5>
        <div className="clm-sk-cont">
          <div className="clm-sk-cont-2">
            <div className="clm-sk-yrs">{skill.experience} Year{skill.experience > 1 ? 's' : ''} Experience</div>
            <div className="clm-sk-percent">{skill.percentage}%</div>
            <animated.div className="clm-sk-percent-2" id={`about-${props.id}-skill-${i}`} style={{ width: `${skill.percentage}%`, ...springs }}>
              <div>&nbsp;</div>
            </animated.div>
            <div className="clm-sk-percent-2" id={`about-${props.id}-skill-${i}-2`} style={{ width: `${skill.percentage}%`, opacity: '50%' }}>
              <div>&nbsp;</div>
            </div>
          </div>
        </div>
      </li>
      </Tracker>
    )
  }

  const tempExps = (
    <ul>
      {skillsFiltered().map((skill, index) => (
        <>
          <SkillComponent skill={skill} i={index} key={index} />
          {skill.child && (
            <li className="li-parent">
              <ul>
                {skill.child.map((skill2, index2) => (
                  <SkillComponent skill={skill2} i={index} key={index2} />
                ))}
              </ul>
            </li>
          )}
        </>
      ))}
    </ul>
  )

  const getExps = () => {
    let ret = tempExps;
    if (themeContext.value.env === 'dev') {
      ret = <ul>
        {exps.map((v, k) => <li key={k}>
          <h5>{v.title}</h5>
          <div className="clm-sk-cont">
            <div className="clm-sk-cont-2">
              <div className="clm-sk-yrs">{v.yrs} Years Experience</div>
              <div className="clm-sk-percent">{v.percent}%</div>
              <div className="clm-sk-percent-2" style={{ width: `${v.percent}%` }}>
                <div>&nbsp;</div>
              </div>
            </div>
          </div>
        </li>)}
      </ul>
    }
    return ret;
  }

  const springs = useSpring({
    from: { opacity: 0, },
    to: { opacity: show ? 1 : 0, },
    delay: 500,
  })
  const springs2 = useSpring({
    from: { opacity: 0, y: 0, },
    to: {
      opacity: show ? 1 : 0,
      y: show ? 0 : 200,
    },
    delay: 600,
  })
  const springs3 = useSpring({
    from: { opacity: 0, y: 0 },
    to: {
      opacity: show ? 1 : 0,
      y: show ? 0 : 100,
    },
    delay: 700,
  })
  const springs4 = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: show ? 1 : 0, transform: `scale(${show ? '1' : '0.8'})` },
    delay: 200,
  })

  return (
    <Tracker id={`about-${props.id}`}
      set={0.1}
      onSuccess={() => {
        setShow(true);
      }}
      // onFail={() => setShow(false)}
    >
      <div className="clm-about clm-fixed-hc" id={`about-${props.id}`}>
        <animated.div style={{ ...springs4 }} className="clm-inner-container clm-container">
          <div className="clm-title" onClick={() => {
            const el = document.getElementById(`projectsbottom`);
            console.log(el);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}>
            <animated.h4 style={{ ...springs }}>ABOUT</animated.h4>
          </div>
          <div className="row">
            <div className="col-md-6 text-center">
              <animated.div style={{ ...springs2 }} className={`clm-profile ${themeContext.value.env}`}>
                <img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/theme/images/profile.jpg" alt="Carl Louis Manuel" />
              </animated.div>
              {themeContext.value.env === 'dev' && (<>
                <h6>Hello</h6>
                <p>World World World World World World World World World World World World World World World World World World World </p>
              </>)}
              {themeContext.value.env !== 'dev' && (<animated.div style={{ ...springs3 }}>
                <h6>I'm Carl Louis Manuel</h6>
                {/* <p>&ldquo;{PROJECT_DESCRIPTION}&rdquo;</p> */}
                <Description />
              </animated.div>)}
            </div>
            {/* <Tracker id={`about-exp-${props.id}`}
              set={window.innerWidth >= 768 ? 0.3 : 0.5}
              onSuccess={() => setShow2(true)}
              onFail={() => setShow2(false)}
            > */}
              <div id={`about-exp-${props.id}`} className="clm-skills col-md-6 text-center">
                {getExps()}
              </div>
            {/* </Tracker> */}
          </div>
        </animated.div>
      </div>
    </Tracker>
  )
}

function Description() {
  const dateString = "June 2012";
  const [time, setTime] = useState(convertDateStringToYears(dateString));

  useEffect(() => {
    setInterval(() => {
      setTime(convertDateStringToYears(dateString));
    }, 1000);
  }, []);

  return <>
    {PROJECTS_DESCRIPTION_AI({
      time
    })}
  </>
}

export default PortfolioAbout;