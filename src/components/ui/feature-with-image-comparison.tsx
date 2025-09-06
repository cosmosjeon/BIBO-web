"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { GripVertical, Github, Linkedin, Mail, MapPin, Monitor, Server } from "lucide-react";

function Feature() {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // 사용자의 모션 감소 설정 확인
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let x = 0;

    if ("touches" in e && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
    } else if ("clientX" in e) {
      x = e.clientX - rect.left;
    }
    
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setInset(percentage);
  };

  // 키보드 접근성 지원
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setInset(prev => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setInset(prev => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setInset(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setInset(100);
    } else if (e.key === ' ') {
      e.preventDefault();
      setInset(50);
    }
  };

  // 두 개의 서로 다른 프로필 데이터
  const profileDataLeft = {
    name: "김민준",
    title: "Frontend Developer",
    description: "사용자 경험을 중시하는 프론트엔드 개발자",
    experience: "3년차",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    location: "서울, 대한민국",
    email: "minjun.kim@example.com",
    company: "테크스타트업",
    hobby: "UI/UX 디자인"
  };

  const profileDataRight = {
    name: "박서연",
    title: "Backend Developer",
    description: "확장 가능한 시스템을 구축하는 백엔드 개발자",
    experience: "5년차", 
    skills: ["Node.js", "Python", "AWS", "Docker"],
    location: "부산, 대한민국",
    email: "seoyeon.park@example.com",
    company: "핀테크기업",
    hobby: "클라우드 아키텍처"
  };

  // 프로필 콘텐츠 컴포넌트 (재사용 위함)
  const ProfileContent = ({ theme }: { theme: 'dark' | 'light' }) => {
    const isDark = theme === 'dark';
    const profileData = isDark ? profileDataLeft : profileDataRight;
    const textColor = isDark ? 'text-white' : 'text-gray-900';
    const subtextColor = isDark ? 'text-gray-300' : 'text-gray-600';
    const descColor = isDark ? 'text-gray-400' : 'text-gray-700';
    const skillBg = isDark ? 'bg-blue-500/20 border-blue-400/30 text-blue-200' : 'bg-green-100 border-green-300 text-green-700';
    const socialBg = isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200';

    return (
      <div className="h-full flex items-center justify-center px-8 md:px-16">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* 프로필 사진 */}
          <div className="flex justify-center lg:justify-center">
            <div className="relative w-56 h-56 lg:w-72 lg:h-72">
              <Image
                src={isDark ? `https://picsum.photos/500/500?random=101` : `https://picsum.photos/500/500?random=202`}
                alt={`${profileData.name} 프로필 사진`}
                fill
                className="object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* 프로필 정보 */}
          <div className="text-center lg:text-left space-y-6">
            <div>
              <h1 className={`text-4xl lg:text-5xl font-bold mb-2 ${textColor}`}>
                {profileData.name}
              </h1>
              <div className={`flex items-center justify-center lg:justify-start gap-2 text-xl lg:text-2xl font-medium ${subtextColor}`}>
                {isDark ? <Monitor className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                <span>{profileData.title}</span>
              </div>
            </div>

            <p className={`text-lg lg:text-xl leading-relaxed ${descColor}`}>
              {profileData.description}
            </p>

            <div className="space-y-3">
              <div className={`flex items-center justify-center lg:justify-start gap-2 ${subtextColor}`}>
                <MapPin className="w-5 h-5" />
                <span>{profileData.location}</span>
              </div>
              <div className={`text-center lg:text-left space-y-2 ${descColor}`}>
                <p>경력: {profileData.experience}</p>
                <p>소속: {profileData.company}</p>
                <p>관심사: {profileData.hobby}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm border ${skillBg}`}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex gap-4 justify-center lg:justify-start">
              <a href="#" className={`p-2 rounded-full transition-colors ${socialBg}`}>
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-full transition-colors ${socialBg}`}>
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className={`p-2 rounded-full transition-colors ${socialBg}`}>
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <div
        className="relative w-full h-full overflow-hidden select-none"
        onMouseMove={onMouseMove}
        onMouseUp={() => setOnMouseDown(false)}
        onTouchMove={onMouseMove}
        onTouchEnd={() => setOnMouseDown(false)}
      >
        {/* 배경 레이어 - 흰색 테마 (전체화면 고정) */}
        <div className="absolute inset-0 bg-white text-black">
          <ProfileContent theme="light" />
        </div>

        {/* 전경 레이어 - 검은색 테마 (전체화면 고정 + clipPath 마스킹) */}
        <div 
          className="absolute inset-0 bg-black text-white"
          style={{
            clipPath: `inset(0 0 0 ${inset}%)`,
            willChange: 'clip-path',
            transform: 'translateZ(0)' // GPU 레이어 강제 생성
          }}
        >
          <ProfileContent theme="dark" />
        </div>

        {/* 슬라이더 구분선 */}
        <div
          className={`bg-white/80 backdrop-blur-sm h-full w-0.5 absolute z-20 top-0 select-none shadow-lg ${
            reducedMotion ? '' : 'transition-all duration-75'
          }`}
          style={{
            left: inset + "%",
          }}
        >
          <button
            className={`bg-white/95 backdrop-blur-sm rounded-full hover:scale-110 focus:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300/50 w-10 h-10 select-none -translate-y-1/2 absolute top-1/2 -ml-5 z-30 cursor-ew-resize flex justify-center items-center shadow-xl border-2 border-white/40 ${
              reducedMotion ? '' : 'transition-all'
            }`}
            onTouchStart={(e) => {
              setOnMouseDown(true);
              onMouseMove(e);
            }}
            onMouseDown={(e) => {
              setOnMouseDown(true);
              onMouseMove(e);
            }}
            onTouchEnd={() => setOnMouseDown(false)}
            onMouseUp={() => setOnMouseDown(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(inset)}
            aria-label="김민준과 박서연 프로필 비교 슬라이더"
            title="좌우 화살표 키, Home/End, 스페이스바로 조작 가능"
          >
            <GripVertical className="h-5 w-5 select-none text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { Feature };
