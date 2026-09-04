import React, {useRef, useEffect, type RefObject} from 'react';
import './genericMarkupSection.scss';

interface GenericMarkupSectionParams {
    title: string;
    children: React.ReactNode;
    left?: boolean;
}

const ANIMATE_IN_THRESHOLD: number = 0.15;

export default function GenericMarkupSection({title, children, left}: GenericMarkupSectionParams): React.ReactElement {

    const ref:RefObject<HTMLElement|null> = useRef<HTMLElement>(null);

    //animate the section in when the user can see a part of it
    useEffect(() => {
        const el:HTMLElement|null = ref?.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]:IntersectionObserverEntry[]):void => {
                if (entry.isIntersecting) {
                    el.classList.add('visible');
                    observer.disconnect();
                }
            },
            { threshold: ANIMATE_IN_THRESHOLD }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section className={`genericMarkupSection ${left ? "alignLeft" : "alignRight"}`} ref={ref}>
            <h2>
                {title}
            </h2>
            {children}

            <div className={"sectionDivider sectionDividerAnimated"} style={{marginTop: '1rem', marginBottom: '1rem'}} />
        </section>
    )
}