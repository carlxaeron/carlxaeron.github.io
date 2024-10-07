import { useEffect, useState } from "react";

export default function Tracker(props) {
    const [show, setShow] = useState(false);

    const trackView = () => {
        const container = document.getElementById(`${props.id}`);
        const containerHeight = container?.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollYH = scrollY + windowHeight;

        const containerTop = container?.getBoundingClientRect().top + scrollY;
        const containerBottom = containerTop + containerHeight;

        const percent = ((containerBottom - containerTop) * (props.set || 0.3));

        if (
            containerTop <= scrollYH &&
            containerBottom >= scrollYH
        ) {
          console.log(`${props.id} ${scrollYH}-${containerTop}=${(scrollYH - containerTop)} ${percent}`)
          if ((scrollYH - containerTop) >= percent) {
            setShow(true);
          }
        }

        if ((containerTop + percent) >= scrollYH) {
          setShow(false);
        }
    };

    useEffect(() => {
        if(props.onSuccess && show === true) props.onSuccess(show);
        if(props.onFail && show === false) props.onFail(show);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    useEffect(() => {
        window.addEventListener("scroll", trackView);
        return () => {
            window.removeEventListener("scroll", trackView);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        {props.children}
      </>
    )
}