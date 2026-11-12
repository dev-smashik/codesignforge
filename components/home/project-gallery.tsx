/**
 * Portfolio image strip from the latest homepage design (desktop 99:45,
 * mobile 85:2495). The thumbnails are supplied Figma assets and decorative
 * in this frame; navigation is handled by the page's existing project CTA.
 */
const desktopProjects = [
  { src: "/landing/home/project-31.png", className: "project-tile--31" },
  { src: "/landing/home/project-26.png", className: "project-tile--26" },
  { src: "/landing/home/project-20.png", className: "project-tile--20" },
  { src: "/landing/home/project-28.png", className: "project-tile--28" },
  { src: "/landing/home/project-16.png", className: "project-tile--16" },
  { src: "/landing/home/project-13.png", className: "project-tile--13" },
] as const;

function ProjectTile({
  src,
  className,
}: {
  src: string;
  className: string;
}) {
  return (
    <div className={`project-tile ${className}`}>
      <img src={src} alt="" draggable={false} />
    </div>
  );
}

export function ProjectGallery() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[626px] z-[1] hidden h-[444px] overflow-hidden min-[1400px]:block"
      >
        <div className="absolute left-0 top-0 h-[218px] w-[335px] overflow-hidden rounded-2xl">
          <img
            src="/landing/home/project-14.png"
            alt=""
            className="absolute -left-px -top-1 h-[225px] w-[338px] max-w-none"
            draggable={false}
          />
        </div>
        <div className="absolute right-0 top-0 h-[218px] w-[335px] overflow-hidden rounded-2xl">
          <img
            src="/landing/home/project-22.png"
            alt=""
            className="absolute -left-[3px] top-0 h-[218px] w-[374px] max-w-none"
            draggable={false}
          />
        </div>
        <div className="absolute left-0 top-[226px] flex items-center gap-2">
          {desktopProjects.map((project) => (
            <ProjectTile key={project.src} {...project} />
          ))}
        </div>
      </div>

      <div
        role="region"
        aria-label="Project gallery, automatically scrolling"
        tabIndex={0}
        className="project-gallery-mobile no-scrollbar relative z-[1] -mt-[17px] w-full overflow-x-auto overflow-y-hidden px-[4.27vw] focus-visible:outline-2 focus-visible:outline-[#fd4f24] focus-visible:outline-offset-2 min-[1400px]:hidden"
      >
        <div className="project-gallery-track">
          <div className="project-gallery-group">
            {desktopProjects.map((project) => (
              <ProjectTile key={project.src} {...project} />
            ))}
          </div>
          <div className="project-gallery-group" aria-hidden="true">
            {desktopProjects.map((project) => (
              <ProjectTile key={`mobile-copy-${project.src}`} {...project} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
