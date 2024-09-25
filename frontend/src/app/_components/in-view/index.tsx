import { useEffect, useRef } from "react";




const InView = ({ action, children }: { action: () => void, children?: React.ReactNode }) => {
  const viewIndicator = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const viewContainer = viewIndicator.current;
    if (viewContainer) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting)
          action();
      });
      observer.observe(viewContainer);
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return (
    <div ref={viewIndicator} >
      {children}
    </div>
  )
}

export default InView;
