import { useSpring, animated } from "@react-spring/web";
import { useTransition } from "react";

function AnimationDown({ children }) {
    // const tos = [];

    // children.map((v,i) => {
    //     const delay = (5000 * (i + 1))
    //     console.log(delay)
    //     tos.push({ y: 0, opacity: 1, delay })
    // })

    // const Test = () => {
    //     const springs = useSpring({
    //         from: { y: -200, opacity: 0, },
    //         to: tos,
    //     })

    //     const newChild = children.map((v,i) => {
    //         console.log(springs)
    //         return <animated.div style={{...springs}}>{v}</animated.div>
    //     })

    //     return newChild;
    // }

    children.map(v => console.log(v))

    const transitions = useTransition(
        // children.map()
    )

    return (
        <>
            {/* <Test/> */}
        </>
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