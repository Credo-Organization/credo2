"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeroCard {
  imageSrc?: string;
  imageAlt?: string;
  badge?: string;
  title: React.ReactNode;
  description: string;
  href?: string;
}

interface FeatureCard {
  value: string;
  title: string;
  description: string;
  icon: any;
  cardClassName: string;
  iconClassName: string;
  rotateClassName: string;
}

interface StackedFeatureCardsProps {
  heroCard: HeroCard;
  featureCards: FeatureCard[];
  sectionTitle?: React.ReactNode;
}

export function StackedFeatureCards({
  heroCard,
  featureCards,
  sectionTitle,
}: StackedFeatureCardsProps) {
  return (
    <section className="py-24 sm:py-32 relative z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {sectionTitle && (
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center md:text-left">
            {sectionTitle}
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Left Side: Hero Card (Sticky) */}
          <div className="md:sticky md:top-[35vh] md:h-fit z-10 pt-12 md:pt-0">
            <div className="flex flex-col items-start gap-6 relative">
              {heroCard.badge && (
                <span className="inline-flex items-center rounded-full border border-border/50 px-3 py-1 text-sm font-medium mb-2 shadow-sm">
                  {heroCard.badge}
                </span>
              )}
              
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">{heroCard.title}</h2>
              
              <p className="text-muted-foreground text-xl mb-8 leading-relaxed">
                {heroCard.description}
              </p>
              
              {heroCard.imageSrc && (
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-inner mt-4">
                  <img 
                    src={heroCard.imageSrc} 
                    alt={heroCard.imageAlt || ""} 
                    className="object-cover w-full h-full transform transition-transform duration-700 hover:scale-105"
                  />
                </div>
              )}
              
              {heroCard.href && (
                <Link 
                  href={heroCard.href} 
                  className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground h-12 px-8 font-semibold transition-all hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 mt-4"
                >
                  Start Building Evidence
                </Link>
              )}
            </div>
          </div>

          {/* Right Side: Stacked Feature Cards */}
          <div className="flex flex-col gap-6 md:gap-8">
            {featureCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={cn(
                    "sticky transition-transform duration-500",
                    card.rotateClassName,
                  )}
                  style={{ top: `calc(8rem + ${index * 1.5}rem)` }}
                >
                  <div className={cn("p-8 sm:p-10 rounded-xl shadow-xl border", card.cardClassName)}>
                    <div className="flex justify-between items-start mb-6 gap-4">
                      <h4 className="text-2xl sm:text-3xl font-bold leading-tight">{card.title}</h4>
                      <span className="text-5xl font-black opacity-20 tracking-tighter shrink-0">{card.value}</span>
                    </div>
                    <p className="text-lg opacity-80 leading-relaxed">{card.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
