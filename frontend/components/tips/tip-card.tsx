"use client";
import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Tip = {
  id: number;
  title: string;
  body: string;
  tags?: string[];
  doctor_name?: string;
  doctor_id?: string;
  created_at?: string;
  views?: number;
};

export function TipCard({ tip }: { tip: Tip }) {
  const EXCERPT_LENGTH = 140;
  const excerpt = tip.body
    ? tip.body.length > EXCERPT_LENGTH
      ? tip.body.slice(0, EXCERPT_LENGTH) + "..."
      : tip.body
    : "";

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200/60 hover:border-blue-200/80 bg-white/80 backdrop-blur-sm overflow-hidden h-full flex flex-col">
      {/* Header with gradient accent */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
              {tip.title}
            </CardTitle>
          </div>
          {tip.views !== undefined && (
            <div className="flex items-center text-xs text-gray-500 ml-2 flex-shrink-0">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {tip.views}
            </div>
          )}
        </div>
        
        <CardDescription className="flex items-center justify-between gap-4 text-xs">
          <span className="inline-flex items-center font-medium text-gray-700 bg-blue-50 px-2 py-1 rounded-full">
            <svg className="w-3 h-3 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Dr. {tip.doctor_name || "Medical Professional"}
          </span>
          <span className="text-gray-500 font-medium">
            {tip.created_at
              ? new Date(tip.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : ""}
          </span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        {tip.tags && tip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tip.tags.map((t) => (
              <span 
                key={t} 
                className="text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200/60 shadow-sm"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 mt-auto">
        <div className="w-full">
          <Link href={`/customer/tips/${tip.id}`} className="block">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-sm hover:shadow-md transition-all duration-200 font-medium py-2.5 rounded-lg"
            >
              Read Full Article
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export default TipCard;