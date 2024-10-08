import { useSpring, animated } from "@react-spring/web";

function AnimationDown(props) {
    const { children } = props;
    const springs = useSpring({
        from: { y: -200, opacity: 0, },
        to: { y: 0, opacity: 1 },
        delay: props.delay || 0,
    })

    return (
        <animated.div style={{...springs}}>{children}</animated.div>
    )
}

function AnimationFade({ children }) {
    const springs = useSpring({
        from: { opacity: 0, },
        to: { opacity: 1, },
    })

    return (
        <animated.div style={{...springs}}>{children}</animated.div>
    )
}

export { AnimationDown, AnimationFade }