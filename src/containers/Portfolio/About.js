import { useContext, useState } from "react";
import { ThemeContext } from "./theme-context";
import { useSpring, animated } from "@react-spring/web";
import Tracker from "./../../components/Tracker";
import { PROJECT_DESCRIPTION, PROJECTS_DESCRIPTION_AI, SKILLS } from "./../../config";

function PortfolioAbout(props) {
    const themeContext = useContext(ThemeContext);
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

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
        skills.forEach((v,k) => {
            v.k = k;
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
            to: { width: `${parseInt(show2 ? skill.percentage : 0)}%`, },
            delay: 100 * parseInt(skill.k),
        })
        
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

    return (
        <Tracker id={`about-${props.id}`} 
            set={0.1}
            onSuccess={() => setShow(true)}
            onFail={() => setShow(false)}    
        >
            <div className="clm-about clm-fixed-hc" id={`about-${props.id}`}>
                <div className="clm-inner-container clm-container">
                    <div className="clm-title">
                        <animated.h4 style={{...springs}}>ABOUT</animated.h4>
                    </div>
                    <div className="row">
                        <div className="col-md-6 text-center">
                            <animated.div style={{...springs2}} className={`clm-profile ${themeContext.value.env}`}>
                                <img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="/theme/images/profile.jpg" alt="Carl Louis Manuel"/>
                            </animated.div>
                            {themeContext.value.env === 'dev' && (<>
                                <h6>Hello</h6>
                                <p>World World World World World World World World World World World World World World World World World World World </p>
                            </>)}
                            {themeContext.value.env !== 'dev' && (<animated.div style={{...springs3}}>
                                <h6>I'm Carl Louis Manuel</h6>
                                {/* <p>&ldquo;{PROJECT_DESCRIPTION}&rdquo;</p> */}
                                {PROJECTS_DESCRIPTION_AI}
                            </animated.div>)}
                        </div>
                        <Tracker id={`about-exp-${props.id}`} 
                            set={window.innerWidth >= 768 ? 0.3 : 0.5}
                            onSuccess={() => setShow2(true)}
                            onFail={() => setShow2(false)}    
                        >
                            <div id={`about-exp-${props.id}`} className="clm-skills col-md-6 text-center">
                                {getExps()}
                            </div>
                        </Tracker>
                    </div>
                </div>
            </div>
        </Tracker>
    )
}

export default PortfolioAbout;