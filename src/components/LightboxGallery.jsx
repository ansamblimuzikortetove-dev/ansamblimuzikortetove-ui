import React, { useEffect, useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import GoldSpinner from "../components/GoldSpinner.jsx";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

/**
 * Enhanced LightboxGallery2
 * ---------------------------------------------------------
 * Features added:
 *  ✔ Gold Spinner when images are loading
 *  ✔ Fade-in for lightbox opening
 *  ✔ Fully controlled/uncontrolled compatibility
 *  ✔ Safe index sync when images change
 *  ✔ Cleaner code with memo and effects
 * ---------------------------------------------------------
 *
 * Props:
 *  images: Array<string | { src, description }>
 *  title?: string
 *  open?: boolean (controlled)
 *  index?: number (controlled)
 *  onClose?: () => void
 *  onIndexChange?: (i: number) => void
 *  className?: string
 */
export default function LightboxGallery({
                                             images = [],
                                             title = "",
                                             className = "",
                                             open: ctrlOpen,
                                             index: ctrlIndex,
                                             onClose,
                                             onIndexChange,
                                         }) {
    /* -------------------------------------------------------
         1. Normalize slide objects
    ------------------------------------------------------- */
    const slides = useMemo(() => {
        return images.map((it) =>
            typeof it === "string" ? { src: it } : it
        );
    }, [images]);

    /* -------------------------------------------------------
         2. Controlled / Uncontrolled Behavior
    ------------------------------------------------------- */
    const [unOpen, setUnOpen] = useState(false);
    const [unIndex, setUnIndex] = useState(0);

    const isControlled = typeof ctrlOpen === "boolean";
    const open = isControlled ? ctrlOpen : unOpen;
    const index = typeof ctrlIndex === "number" ? ctrlIndex : unIndex;

    /* -------------------------------------------------------
         3. Loading spinner state
    ------------------------------------------------------- */
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Reset loading when new images come in or index changes
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 280);
        return () => clearTimeout(timeout);
    }, [index, slides.length]);


    /* -------------------------------------------------------
         4. Auto-fix index when slide count changes
    ------------------------------------------------------- */
    useEffect(() => {
        if (index >= slides.length && slides.length > 0) {
            if (isControlled) {
                onIndexChange?.(0);
            } else {
                setUnIndex(0);
            }
        }
    }, [slides.length]); // eslint-disable-line react-hooks/exhaustive-deps


    /* -------------------------------------------------------
         5. Render
    ------------------------------------------------------- */
    return (
        <div className={className}>
            {/* SPINNER OVERLAY */}
            {open && loading && (
                <div className="
            fixed inset-0 z-[9999] flex items-center justify-center
            bg-black/60 backdrop-blur-sm animate-fadeUp
        ">
                    <GoldSpinner size={50} />
                </div>
            )}

            <Lightbox
                open={open}
                index={index}
                close={() => {
                    if (isControlled) onClose?.();
                    else setUnOpen(false);
                }}
                slides={slides}

                /* PLUGINS */
                plugins={[Thumbnails, Zoom]}

                /* CLEAN UI */
                render={{
                    buttonPrev: undefined,
                    buttonNext: undefined,
                    buttonClose: undefined,
                }}

                /* LIGHTBOX SETTINGS */
                carousel={{ finite: false }}
                controller={{ closeOnBackdropClick: true }}

                /* SYNC INDEX WHEN VIEW CHANGES */
                on={{
                    view: ({ index: i }) =>
                        isControlled ? onIndexChange?.(i) : setUnIndex(i),
                }}

                /* CAPTIONS + THUMBNAILS */
                captions={{ descriptionTextAlign: "start" }}
                thumbnails={{ vignette: false }}
            />
        </div>
    );
}