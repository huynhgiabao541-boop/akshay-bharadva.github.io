
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import type { PortfolioItem } from "@/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import ImageLightboxModal from "./ImageLightboxModal";

interface FeaturedProjectProps {
  project: PortfolioItem;
  index: number;
}

export default function FeaturedProject({
  project,
  index,
}: FeaturedProjectProps) {
  const isReversed = index % 2 !== 0;

  // Extract GitHub link from markdown if it exists
  const descriptionWithoutGithub =
    project.description
      ?.replace(/\[View Source on GitHub\]\(.*\)/, "")
      .trim() || "";
  const githubMatch = project.description?.match(
    /\[View Source on GitHub\]\((.*?)\)/,
  );
  const githubUrl = githubMatch ? githubMatch[1] : null;

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 lg:gap-12"
      >
        {/* Image Column */}
        <div
          className={cn(
            "group relative md:col-span-7",
            isReversed ? "md:order-last" : "md:order-first",
          )}
        >
          <div
            onClick={() => project.image_url && setIsLightboxOpen(true)}
            className="block rounded-2xl overflow-hidden bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-border/50 cursor-pointer relative group/img"
          >
            {project.image_url ? (
              <>
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="aspect-video w-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-primary/90 text-primary-foreground font-mono text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                    🔍 Xem ảnh kích thước lớn
                  </span>
                </div>
              </>
            ) : (
              <div className="aspect-video w-full bg-secondary flex items-center justify-center text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>
        </div>

        {/* Text Content Column */}
        <div
          className={cn(
            "relative flex flex-col md:col-span-5",
            isReversed
              ? "md:text-right md:items-end"
              : "md:text-left md:items-start",
          )}
        >
          <p className="font-mono text-sm text-primary mb-2">Tác Phẩm Nổi Bật</p>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            <button
              onClick={() => project.image_url && setIsLightboxOpen(true)}
              className="hover:text-primary transition-colors text-left"
            >
              {project.title}
            </button>
          </h3>

          {/* Description Box */}
          <div
            className={cn(
              "rounded-2xl bg-card p-8 shadow-wiz border border-border/50 z-10 w-full",
              "md:w-[120%] lg:w-[130%]",
              isReversed
                ? "md:mr-[-20%] lg:mr-[-30%]"
                : "md:ml-[-20%] lg:ml-[-30%]",
            )}
          >
            <div
              className="prose prose-sm max-w-none text-muted-foreground
              prose-p:text-muted-foreground
              prose-a:text-primary hover:prose-a:text-primary/80
              prose-strong:text-foreground
              prose-ul:list-none prose-ul:p-0"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {descriptionWithoutGithub}
              </ReactMarkdown>
            </div>
          </div>

          {/* Tech Stack / Style Tags */}
          {project.tags && project.tags.length > 0 && (
            <div
              className={cn(
                "flex flex-wrap gap-2 font-mono text-xs text-muted-foreground mt-6",
                isReversed ? "md:justify-end" : "md:justify-start",
              )}
            >
              {project.tags.map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full font-semibold">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageUrl={project.image_url}
        title={project.title}
        subtitle={project.subtitle}
        description={project.description}
        tags={project.tags}
      />
    </>
  );
}
