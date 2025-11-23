import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

/**
 * CloudImage
 * - Accepts a Cloudinary URL from Strapi
 * - Applies on-the-fly transformation:
 *   - width (w), automatic format (f=auto), quality (q)  for performance
 */
export default function CloudImage({
                                       src,
                                       alt = "",
                                       width = 1200,
                                       className = "w-full h-auto object-cover",
                                       placeholder,
                                   }) {
    const transformed = src?.includes("res.cloudinary.com")
        ? `${src}${src.includes("?") ? "&" : "?"}w=${width}&f=auto&q=80`
        : src;

    return (
        <LazyLoadImage
            src={transformed}
            alt={alt}
            effect="blur"
            placeholderSrc={placeholder}
            width="100%"
            height="auto"
            className={className}
        />
    );
}