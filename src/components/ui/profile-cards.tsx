"use client"

import Image from "next/image";
import { Github, Linkedin, Mail } from "lucide-react";

type Profile = {
  name: string;
  intro: string;
  education: string;
  career: string;
  email?: string;
  github?: string;
  linkedin?: string;
  imageSrc: string;
  imageAlt: string;
};

const profiles: Profile[] = [
  {
    name: "Dohyun Jeon",
    intro: "풀스택 개발자 · 사용자 가치 중심",
    education: "컴퓨터공학 전공",
    career: "웹/모바일 5+년 경험",
    email: "mailto:dohyun.jeon@example.com",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    imageSrc: "/도현 사진.png",
    imageAlt: "Dohyun profile photo",
  },
  {
    name: "Ownjun Seo",
    intro: "프로덕트 디자이너 · 문제 해결 러버",
    education: "시각디자인 전공",
    career: "프로덕트 디자인 4+년",
    email: "mailto:ownjun.seo@example.com",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
    imageSrc: "/원준사진.png",
    imageAlt: "Ownjun profile photo",
  },
];

export function ProfileCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
      {profiles.map((p) => (
        <article
          key={p.name}
          className="rounded-2xl bg-zinc-200/95 text-zinc-900 p-6 md:p-8 lg:p-10 shadow-2xl ring-1 ring-white/30 min-h-[400px] flex"
          data-native-cursor
        >
          <div className="flex w-full gap-6 md:gap-8">
            <div className="shrink-0">
              <div className="relative size-28 md:size-32 lg:size-36 rounded-lg overflow-hidden bg-zinc-400/60">
                <Image
                  src={p.imageSrc}
                  alt={p.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                  priority
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{p.name}</h3>
                <p className="text-lg md:text-xl text-zinc-700">{p.intro}</p>
                <dl className="mt-3 space-y-1 text-base md:text-lg">
                  <div className="flex gap-2">
                    <dt className="text-zinc-500">학력</dt>
                    <dd className="text-zinc-800">{p.education}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-zinc-500">이력</dt>
                    <dd className="text-zinc-800">{p.career}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex items-center gap-3 pt-4">
                {p.email && (
                  <a
                    href={p.email}
                    className="inline-flex items-center gap-2 rounded-md bg-zinc-900 text-white px-3 py-2 text-sm md:text-base hover:bg-zinc-800 transition-colors"
                    aria-label={`${p.name} email`}
                  >
                    <Mail className="size-4" /> Email
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-md bg-white text-zinc-900 px-3 py-2 text-sm md:text-base hover:bg-zinc-100 transition-colors ring-1 ring-zinc-300"
                    aria-label={`${p.name} github`}
                  >
                    <Github className="size-4" /> GitHub
                  </a>
                )}
                {p.linkedin && (
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-md bg-white text-zinc-900 px-3 py-2 text-sm md:text-base hover:bg-zinc-100 transition-colors ring-1 ring-zinc-300"
                    aria-label={`${p.name} linkedin`}
                  >
                    <Linkedin className="size-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

