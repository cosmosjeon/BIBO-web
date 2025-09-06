"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { GripVertical, Github, Linkedin, Mail, MapPin, Monitor, Server } from "lucide-react";

function Feature() {
  const [inset, setInset] = useState<number>(50);
  const [onMouseDown, setOnMouseDown] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 사용자의 모션 감소 설정 및 모바일 환경 확인
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    
    setReducedMotion(mediaQuery.matches);
    setIsMobile(mobileQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    const handleMobileChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMotionChange);
    mobileQuery.addEventListener('change', handleMobileChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      mobileQuery.removeEventListener('change', handleMobileChange);
    };
  }, []);

  const onMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!onMouseDown) return;

    const rect = e.currentTarget.getBoundingClientRect();
    let position = 0;

    if (isMobile) {
      // 모바일에서는 상하 스와이프 (Y축)
      if ("touches" in e && e.touches.length > 0) {
        position = e.touches[0].clientY - rect.top;
      } else if ("clientY" in e) {
        position = e.clientY - rect.top;
      }
      const percentage = Math.max(0, Math.min(100, (position / rect.height) * 100));
      setInset(percentage);
    } else {
      // 데스크톱에서는 좌우 스와이프 (X축)
      if ("touches" in e && e.touches.length > 0) {
        position = e.touches[0].clientX - rect.left;
      } else if ("clientX" in e) {
        position = e.clientX - rect.left;
      }
      const percentage = Math.max(0, Math.min(100, (position / rect.width) * 100));
      setInset(percentage);
    }
  };

  // 키보드 접근성 지원
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isMobile) {
      // 모바일에서는 상하 화살표 키 사용
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setInset(prev => Math.max(0, prev - 5));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setInset(prev => Math.min(100, prev + 5));
      }
    } else {
      // 데스크톱에서는 좌우 화살표 키 사용
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setInset(prev => Math.max(0, prev - 5));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setInset(prev => Math.min(100, prev + 5));
      }
    }
    
    // 공통 키
    if (e.key === 'Home') {
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
    name: "Dohyun Jeon",
    title: "Full Stack Developer",
    description: "Passionate developer creating innovative digital solutions with modern technologies",
    experience: "5+ years",
    skills: ["React", "TypeScript", "Node.js", "Python", "AWS"],
    location: "Seoul, South Korea",
    email: "dohyun.jeon@example.com",
    company: "Tech Innovation Labs",
    hobby: "Open Source Contributing"
  };

  const profileDataRight = {
    name: "Ownjun Seo",
    title: "Product Designer",
    description: "Creating user-centered designs that bridge the gap between technology and humanity",
    experience: "4+ years", 
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
    location: "Busan, South Korea",
    email: "ownjun.seo@example.com",
    company: "Design Studio Pro",
    hobby: "Digital Art & Photography"
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
      <div className="h-full flex items-stretch">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2">
          {isDark ? (
            <>
              {/* 도현 프로필 - 왼쪽 텍스트, 오른쪽 사진 */}
              <div className="flex flex-col justify-between px-8 md:px-12 lg:px-16 xl:px-20 py-12 lg:py-16">
                {/* 메인 텍스트 - 중앙 정렬 */}
                <div className="flex-1 flex flex-col justify-center">
                  <div>
                    <p className={`text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light mb-4 lg:mb-6 ${subtextColor}`}>
                      Hi, I am
                    </p>
                    <h1 className={`text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold ${textColor} leading-tight`}>
                      {profileData.name}
                    </h1>
                  </div>
                </div>

                {/* 소셜 아이콘들 - 하단 고정 */}
                <div className="flex gap-4">
                  <a href="#" className={`p-2 lg:p-3 rounded-lg transition-colors ${socialBg}`}>
                    <Mail className="w-5 h-5 lg:w-6 lg:h-6" />
                  </a>
                  <a href="#" className={`p-2 lg:p-3 rounded-lg transition-colors ${socialBg}`}>
                    <Github className="w-5 h-5 lg:w-6 lg:h-6" />
                  </a>
                  <a href="#" className={`p-2 lg:p-3 rounded-lg transition-colors ${socialBg}`}>
                    <Linkedin className="w-5 h-5 lg:w-6 lg:h-6" />
                  </a>
                </div>
              </div>

              <div className="relative flex items-center justify-center p-2 lg:p-4">
                <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px]">
                  <Image
                    src="/도현 사진.png"
                    alt={`${profileData.name} profile photo`}
                    fill
                    className="object-cover object-center shadow-2xl"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 원준 프로필 - 왼쪽 사진, 오른쪽 텍스트 */}
              <div className="relative flex items-center justify-center p-2 lg:p-4">
                <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px]">
                  <Image
                    src="/원준사진.png"
                    alt={`${profileData.name} profile photo`}
                    fill
                    className="object-cover object-center shadow-2xl"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between px-8 md:px-12 lg:px-16 xl:px-20 py-12 lg:py-16">
                {/* 메인 텍스트 - 중앙 정렬 */}
                <div className="flex-1 flex flex-col justify-center">
                  <div>
                    <p className={`text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light mb-4 lg:mb-6 ${subtextColor}`}>
                      Hi, I am
                    </p>
                    <h1 className={`text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold ${textColor} leading-tight`}>
                      {profileData.name}
                    </h1>
                  </div>
                </div>

                {/* 소셜 아이콘들 - 하단 고정 */}
                <div className="flex gap-4">
                  <a href="#" className={`p-2 lg:p-3 rounded-lg transition-colors ${socialBg}`}>
                    <Mail className="w-5 h-5 lg:w-6 lg:h-6" />
                  </a>
                  <a href="#" className={`p-2 lg:p-3 rounded-lg transition-colors ${socialBg}`}>
                    <Github className="w-5 h-5 lg:w-6 lg:h-6" />
                  </a>
                  <a href="#" className={`p-2 lg:p-3 rounded-lg transition-colors ${socialBg}`}>
                    <Linkedin className="w-5 h-5 lg:w-6 lg:h-6" />
                  </a>
                </div>
              </div>
            </>
          )}
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
        {/* 배경 레이어 - 검은색 테마 (전체화면 고정) */}
        <div className="absolute inset-0 bg-black text-white">
          <ProfileContent theme="light" />
        </div>

        {/* 전경 레이어 - 검은색 테마 (전체화면 고정 + clipPath 마스킹) */}
        <div 
          className="absolute inset-0 bg-black text-white"
          style={{
            clipPath: isMobile 
              ? `inset(${inset}% 0 0 0)` // 모바일: 상하 방향
              : `inset(0 0 0 ${inset}%)`, // 데스크톱: 좌우 방향
            willChange: 'clip-path',
            transform: 'translateZ(0)' // GPU 레이어 강제 생성
          }}
        >
          <ProfileContent theme="dark" />
        </div>

        {/* 슬라이더 구분선 */}
        <div
          className={`bg-white/80 backdrop-blur-sm absolute z-20 select-none shadow-lg ${
            isMobile ? 'w-full h-0.5 left-0' : 'h-full w-0.5 top-0'
          } ${reducedMotion ? '' : 'transition-all duration-75'}`}
          style={{
            [isMobile ? 'top' : 'left']: inset + "%",
          }}
        >
          <button
            className={`bg-white/95 backdrop-blur-sm rounded-full hover:scale-110 focus:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300/50 w-10 h-10 select-none absolute z-30 flex justify-center items-center shadow-xl border-2 border-white/40 ${
              isMobile 
                ? '-translate-x-1/2 left-1/2 -mt-5 cursor-ns-resize' 
                : '-translate-y-1/2 top-1/2 -ml-5 cursor-ew-resize'
            } ${reducedMotion ? '' : 'transition-all'}`}
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
            aria-label="Dohyun Jeon and Ownjun Seo profile comparison slider"
            title={isMobile ? "Use up/down arrow keys, Home/End, or spacebar to control" : "Use left/right arrow keys, Home/End, or spacebar to control"}
          >
            <GripVertical className={`h-5 w-5 select-none text-gray-700 ${isMobile ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export { Feature };
