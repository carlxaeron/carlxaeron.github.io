import { useContext } from "react";
import { ThemeContext } from "./theme-context";
import { useSpring, animated } from "@react-spring/web";

function PortfolioAbout() {
    const themeContext = useContext(ThemeContext);

    const exps = [
        {
            title: 'Title #1',
            yrs: 5,
            percent: 66,
        },
    ];

    const skills = [
        {
            name: "PHP",
            experience: "8",
            percentage: "95",
            width: "95",
            parent: true,
        },
        {
            name: "Laravel",
            experience: "7",
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
            experience: "7",
            percentage: "95",
            width: "95",
        },
        {
            name: "Javascript (JS)",
            experience: "7",
            percentage: "95",
            width: "95",
            parent: true,
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
            name: "ReactJS",
            experience: "1",
            percentage: "95",
            width: "95",
        },
        {
            name: "NPM (Node.js)",
            experience: "5",
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
            experience: "8",
            percentage: "95",
            width: "95",
            parent: true,
        },
        {
            name: "Twitter Bootstrap",
            experience: "4",
            percentage: "90",
            width: "90",
        },
        {
            name: "TailwindCSS",
            experience: "2",
            percentage: "95",
            width: "95",
        },
        {
            name: "HTML/HTML5",
            experience: "8",
            percentage: "95",
            width: "95",
            parent: true,
        },
        {
            name: "Jade/Pug Template",
            experience: "6",
            percentage: "95",
            width: "95",
        },
        {
            name: "Version Control",
            experience: "7",
            percentage: "95",
            width: "95",
        },
        {
            name: "Git/SVN",
            experience: "8",
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
            experience: "6",
            percentage: "90",
            width: "90",
        }
    ];

    const skillsFiltered = () => {
        const s = [];
        let parent = -1;
        skills.forEach((v,k) => {
            if(v.parent) {
                s.push(v);
                parent++;
            } else {
                if(!s[parent]?.child) s[parent] = { ...s[parent], child: [] };
                s[parent].child.push(v);
            }
        });
        return s;
    }

    const SkillComponent = ({ skill, i }) => { 
        const springs = useSpring({
            from: { width: '0%', },
            to: { width: `${parseInt(skill.percentage)}%`, },
            delay: 500 * parseInt(i),
        })

        console.log(i);
        
        return (
            <li key={i}>
                <h5>{skill.name}</h5>
                <div className="clm-sk-cont">
                    <div className="clm-sk-cont-2">
                        <div className="clm-sk-yrs">{skill.experience} Years Experience</div>
                        <div className="clm-sk-percent">{skill.percentage}%</div>
                        <animated.div className="clm-sk-percent-2" style={{width: `${skill.percentage}%`, ...springs}}>
                            <div>&nbsp;</div>
                        </animated.div>
                    </div>
                </div>
            </li>
        )
    }

    const tempExps = (
        <ul>
            { skillsFiltered().map((skill, index) => (
                <>
                    <SkillComponent skill={skill} i={index} key={index} />
                    { skill.child && (
                        <li className="li-parent">
                            <ul>
                                { skill.child.map((skill2, index2) => (
                                    <SkillComponent skill={skill2} i={index} key={index2} />
                                )) }
                            </ul>
                        </li>
                    ) }
                </>
            )) }
        </ul>
    )

    const getExps = () => {
        let ret = tempExps;
        if(themeContext.value.env === 'dev') {
            ret = <ul>
                { exps.map((v,k) => <li key={k}>
                    <h5>{v.title}</h5>
                    <div className="clm-sk-cont">
                        <div className="clm-sk-cont-2">
                            <div className="clm-sk-yrs">{v.yrs} Years Experience</div>
                            <div className="clm-sk-percent">{v.percent}%</div>
                            <div className="clm-sk-percent-2" style={{width: `${v.percent}%`}}>
                                <div>&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </li>) }
            </ul>
        }
        return ret;
    }

    return (
        <div className="clm-about clm-fixed-hc" id="about">
            <div className="clm-inner-container clm-container">
                <div className="clm-title">
                    <h4>ABOUT </h4>
                </div>
                <div className="row">
                    <div className="col-md-6 text-center">
                        <div className={`clm-profile ${themeContext.value.env}`}>
                            <img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/theme/images/profile.jpg" alt="Carl Louis Manuel"/>
                        </div>
                        {themeContext.value.env === 'dev' && (<>
                            <h6>Hello</h6>
                            <p>World World World World World World World World World World World World World World World World World World World </p>
                        </>)}
                        {themeContext.value.env !== 'dev' && (<>
                            <h6>I'm Carl Louis Manuel</h6>
                            <p>&ldquo;I am a fullstack web developer working for over 12 years since 2012, I am mainly focused on web development using HTML, CSS, JS (AngularJS, VueJS, JQuery), PHP/MySQL - (XAMPP, WAMP, LAMP). I build website from scratch using any top frameworks such as Laravel, Codeigniter, and Zend on any development environment with support of Linux command or local development environment and my code is up to the current standards, secure, and safe from SQL injections or similar hacking attempts with understanding of OOP. I could be a maintenance support with high analytical thinking skill to solve complex problems. All the websites I developed was built using the latest version of PHP. I have knowledge on building a website from CMS such as Wordpress, Drupal and Joomla, I could make customized themes. I have experienced in SEO friendly website that may affect the visibility of a website or a web page in a search engine’s results. I always adopt latest technologies to meet the market requirements and I am creating a responsive web design that loads correctly in all modern browsers and smaller devices.&rdquo;</p>
                        </>)}
                    </div>
                    <div className="clm-skills col-md-6 text-center">
                        {getExps()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioAbout;