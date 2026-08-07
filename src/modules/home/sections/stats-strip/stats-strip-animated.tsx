'use client';

import {
  Clock3Icon,
  HeadphonesIcon,
  MessageSquareCheckIcon,
  UsersRoundIcon,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ICON_SIZE_CLASS } from '@/constants';

type StatKey =
  'answeredTickets' | 'userSatisfaction' | 'activeUsers' | 'onlineSupport';

interface IStat {
  id: number;
  labelKey: StatKey;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
}

interface StatsStripAnimatedProps {
  ariaLabel: string;
  labels: Record<StatKey, string>;
}

const stats: IStat[] = [
  {
    id: 1,
    labelKey: 'answeredTickets',
    value: 6500,
    suffix: '+',
    icon: MessageSquareCheckIcon,
  },
  {
    id: 2,
    labelKey: 'userSatisfaction',
    value: 98,
    suffix: '٪',
    icon: HeadphonesIcon,
  },
  {
    id: 3,
    labelKey: 'activeUsers',
    value: 2410,
    suffix: '+',
    icon: UsersRoundIcon,
  },
  {
    id: 4,
    labelKey: 'onlineSupport',
    value: 24,
    suffix: '/۷',
    icon: Clock3Icon,
  },
];

const numberFormatter = new Intl.NumberFormat('fa-IR');

const StatsStripAnimated = ({ ariaLabel, labels }: StatsStripAnimatedProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let animationFrameId: number;

    if (prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(() => {
        setProgress(1);
      });

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }

    const duration = 1400;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const rawProgress = Math.min((timestamp - startTime) / duration, 1);

      const easedProgress = 1 - Math.pow(1 - rawProgress, 4);

      setProgress(easedProgress);

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className="mx-auto w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8"
    >
      <div
        className={`border-primary-100 bg-primary-50/70 ease-standard grid grid-cols-2 overflow-hidden rounded-xl border transition-all duration-700 md:grid-cols-4 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        } motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          const count = Math.floor(stat.value * progress);

          return (
            <article
              key={stat.id}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
              }}
              className={`ease-standard relative flex min-h-24 items-center justify-center gap-3 px-3 py-4 transition-all duration-500 ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              } motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none md:min-h-28 md:px-4 lg:gap-4 lg:px-6`}
            >
              {index !== stats.length - 1 && (
                <span
                  aria-hidden="true"
                  className="bg-primary-200 absolute top-1/2 left-0 hidden h-10 w-px -translate-y-1/2 md:block"
                />
              )}

              <div className="text-primary-500 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm lg:size-10">
                <Icon aria-hidden="true" className={ICON_SIZE_CLASS.md} />
              </div>

              <div className="flex min-w-0 flex-col gap-1">
                <strong
                  className="text-title text-primary-500 leading-none"
                  dir="rtl"
                >
                  {stat.prefix}
                  {numberFormatter.format(count)}
                  {stat.suffix}
                </strong>

                <span className="text-caption lg:text-body-sm whitespace-nowrap text-neutral-500">
                  {labels[stat.labelKey]}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default StatsStripAnimated;
