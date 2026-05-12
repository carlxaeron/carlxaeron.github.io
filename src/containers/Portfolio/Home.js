import { AnimationDown } from "../../components/Animations";

function PortfolioHome() {
  return (
    <div className="clm-cover clm-fixed-hc" id="home">
      <div className="clm-c-content">
        <AnimationDown>
          <h2 className="!text-[1.5rem] md:!text-[2.9rem] text-white drop-shadow-md">
            Hi, I&apos;m a <br />
            Software Engr., Web/App Developer, Fullstack Developer - ReactJS | NextJS |
            Vue | NuxtJS | PHP | Laravel | CodeIgniter | Wordpress | Flutter | React Native |
            Javascript | Typescript
          </h2>
        </AnimationDown>
        <AnimationDown delay={300}>
          <h3 className="!text-[1rem] text-gray-100 drop-shadow-sm">
            I&apos;m passionate about building innovative, scalable, and secure web solutions.
            I love tackling new challenges that push the boundaries of what&apos;s possible in
            web/app development.
          </h3>
        </AnimationDown>
        <AnimationDown delay={500}>
          <a className="btn btn-primary" href="#portfolio">
            View my works
          </a>
        </AnimationDown>
      </div>
    </div>
  );
}

export default PortfolioHome;
