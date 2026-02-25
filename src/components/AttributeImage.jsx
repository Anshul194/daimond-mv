import React, { useState, useEffect } from 'react';

const AttributeImage = ({ src, alt, className, fallbackSrc = "https://www.grownbrilliance.com/images/shape/round-hover.svg" }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src);
        setHasError(false);
    }, [src]);

    const handleError = () => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleError}
        />
    );
};

export default AttributeImage;
