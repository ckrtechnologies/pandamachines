import { useLayoutEffect } from "react";

/**
 * Locks body scroll when `locked` is true
 * Prevents layout shift caused by scrollbar disappearance
 */
const useScrollLock = (locked = true) => {
    useLayoutEffect(() => {
        if (!locked) return;

        const body = document.body;

        const originalOverflow = body.style.overflow;
        const originalPaddingRight = body.style.paddingRight;

        const scrollBarWidth =
            window.innerWidth - document.documentElement.clientWidth;

        /* LOCK */
        body.style.overflow = "hidden";

        if (scrollBarWidth > 0) {
            body.style.paddingRight = `${scrollBarWidth}px`;
        }

        return () => {
            /* RESTORE */
            body.style.overflow = originalOverflow;
            body.style.paddingRight = originalPaddingRight;
        };
    }, [locked]);
};

export default useScrollLock;