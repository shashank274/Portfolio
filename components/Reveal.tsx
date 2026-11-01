"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  as?: "div" | "article" | "section";
  className?: string;
  id?: string;
  delay?: number;
  children: React.ReactNode;
};

// Adds the "in" class once the element scrolls into view.
export default function Reveal({ as = "div", className = "", id, delay = 0, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} id={id} className={`${className} ${inView ? "in" : ""}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
