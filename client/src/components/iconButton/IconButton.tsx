import React, {useEffect, useState} from 'react';
import './iconButton.scss';

interface IconButtonParams extends React.ComponentProps<"div"> {
    imageLoader: () => Promise<{default: string}>;
    showElementRef: React.RefObject<HTMLElement | null>;
    onClick: () => void;

    alt?: string;
}

export default function IconButton({imageLoader, showElementRef, onClick, alt, ...props}: IconButtonParams): React.ReactElement {

    //load the image
    const [icon, setIcon] = useState<string>('');
    useEffect(() => {
        imageLoader().then(module => setIcon(module.default));
    }, [imageLoader]);
    
    //listen to the user hovering over the show element
    const [visible, setVisible] = useState<boolean>(false);
    useEffect(() => {
        const element = showElementRef.current;
        if (!element) return;
        
        const show = () => setVisible(true);
        const hide = () => setVisible(false);
        
        element.addEventListener("mouseenter", show);
        element.addEventListener("mouseleave", hide);
        
        return () => {
            element.removeEventListener("mouseenter", show);
            element.removeEventListener("mouseleave", hide);
        }
    }, [showElementRef]);

    return (
        <React.Fragment>
            {icon && (
                <div className={`iconButtonWrapper ${visible ? "visible" : "hidden"}`} {...props} onClick={onClick}>
                    <img src={icon} alt={alt ?? "An icon button"} />
                </div>
            )}
        </React.Fragment>
    )
}