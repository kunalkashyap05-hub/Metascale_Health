import { useEffect } from 'react';

/**
 * useParallaxDirective — React hook mimicking an "Angular Directive".
 * Attaches 3D parallax movement to a DOM element based on mouse position.
 * Appropriately separates "Low-level DOM logic" from "Component UI logic".
 * 
 * @param {RefObject} ref — The element to apply 3D movement to.
 * @param {number} factor — Intensity of the parallax (default: 20).
 */
export function useParallaxDirective(ref, factor = 20) {
  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / factor;
      const y = (e.clientY - innerHeight / 2) / factor;

      el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [ref, factor]);
}

export default useParallaxDirective;
