'use client'

import React from "react";

export const Component = () => {
  return (
    <section className="grid place-content-center gap-2 bg-background w-full h-screen text-black">
      <FlipLink href="https://x.com/thisis_vaib">Twitter</FlipLink>
      <FlipLink href="https://linkedin.com/in/vaib215">Linkedin</FlipLink>
      <FlipLink href="https://github.com/vaib215">Github</FlipLink>
      <FlipLink href="https://instagram.com/thisis_vaib">Instagram</FlipLink>
    </section>
  );
};

interface FlipLinkProps {
  children: string;
  href: string;
  className?: string;
}

const FlipLink = ({ children, href, className }: FlipLinkProps) => {
  const baseClassName = "group text-primary relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl";
  const finalClassName = className || baseClassName;

  // Handle line breaks by splitting text into lines
  const lines = children.split('\n');
  
  return (
    <a
      href={href}
      className={finalClassName}
      style={{
        lineHeight: 0.75,
      }}
    >
      <div className="flex flex-col">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="flex flex-wrap">
            {line.split("").map((letter, i) => (
              <span
                key={`${lineIndex}-${i}`}
                className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
                style={{
                  transitionDelay: `${(lineIndex * line.length + i) * 25}ms`,
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="flex flex-wrap">
            {line.split("").map((letter, i) => (
              <span
                key={`${lineIndex}-${i}`}
                className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
                style={{
                  transitionDelay: `${(lineIndex * line.length + i) * 25}ms`,
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </div>
        ))}
      </div>
    </a>
  );
};

export { FlipLink };