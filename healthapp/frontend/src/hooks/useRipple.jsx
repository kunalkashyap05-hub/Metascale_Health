import { useState, useLayoutEffect } from 'react';

/**
 * useRipple — Angular Material signature Ripple effect.
 * Attaches a ripple animation to any button or interactive element.
 * Appropriately brings the "Material Feel" from the Angular ecosystem.
 */
export const useRipple = (ref) => {
  const [ripples, setRipples] = useState([]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const showRipple = (e) => {
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple = {
        x,
        y,
        size,
        id: Date.now()
      };

      setRipples((prev) => [...prev, newRipple]);
    };

    element.addEventListener('mousedown', showRipple);
    return () => element.removeEventListener('mousedown', showRipple);
  }, [ref]);

  return ripples.map((ripple) => (
    <span
      key={ripple.id}
      style={{
        position: 'absolute',
        left: ripple.x,
        top: ripple.y,
        width: ripple.size,
        height: ripple.size,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'ripple 600ms linear',
        pointerEvents: 'none'
      }}
      onAnimationEnd={() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }}
    />
  ));
};

export default useRipple;
