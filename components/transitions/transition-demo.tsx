'use client';

import { useState } from 'react';
import { usePageTransition } from './transition-context';
import SectionTransition from './section-transition';

/**
 * TransitionDemo - Example component showing all transition features
 * Use this as a reference for implementing transitions in your components
 */
export default function TransitionDemo() {
  const { startTransition, endTransition } = usePageTransition();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Example: Trigger a page transition overlay
   */
  const handlePageTransition = async (variant: 'fade' | 'blur' | 'gradient' | 'dark') => {
    setIsLoading(true);
    
    // Start transition with chosen variant
    await startTransition(variant, 1000);
    
    // Simulate async operation (e.g., data fetch, route change)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // End transition
    endTransition();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-8 space-y-12">
      {/* Page Overlay Transitions */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Page Overlay Transitions</h2>
        <p className="text-muted-foreground">
          Full-screen transitions for route changes or major state updates
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handlePageTransition('fade')}
            disabled={isLoading}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            Fade Overlay
          </button>
          <button
            onClick={() => handlePageTransition('blur')}
            disabled={isLoading}
            className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
          >
            Blur Overlay
          </button>
          <button
            onClick={() => handlePageTransition('gradient')}
            disabled={isLoading}
            className="px-4 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            Gradient Overlay
          </button>
          <button
            onClick={() => handlePageTransition('dark')}
            disabled={isLoading}
            className="px-4 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90 transition-colors disabled:opacity-50"
          >
            Dark Overlay
          </button>
        </div>
      </section>

      {/* Section Transitions */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Section Transitions</h2>
        <p className="text-muted-foreground">
          Scroll-based animations that trigger when sections enter viewport
        </p>

        {/* Fade Variant */}
        <SectionTransition variant="fade" duration={600}>
          <div className="p-6 bg-primary/10 rounded-lg border-2 border-primary/20">
            <h3 className="text-xl font-semibold mb-2">Fade Transition</h3>
            <p className="text-muted-foreground">
              Simple fade-in effect without movement
            </p>
            <code className="block mt-2 p-2 bg-muted rounded text-sm">
              {`<SectionTransition variant="fade">`}
            </code>
          </div>
        </SectionTransition>

        {/* Fade Up Variant */}
        <SectionTransition variant="fade-up" duration={700}>
          <div className="p-6 bg-secondary/10 rounded-lg border-2 border-secondary/20">
            <h3 className="text-xl font-semibold mb-2">Fade Up Transition</h3>
            <p className="text-muted-foreground">
              Fades in while sliding up from below (most common)
            </p>
            <code className="block mt-2 p-2 bg-muted rounded text-sm">
              {`<SectionTransition variant="fade-up" duration={700}>`}
            </code>
          </div>
        </SectionTransition>

        {/* Fade Down Variant */}
        <SectionTransition variant="fade-down" duration={700}>
          <div className="p-6 bg-accent/10 rounded-lg border-2 border-accent/20">
            <h3 className="text-xl font-semibold mb-2">Fade Down Transition</h3>
            <p className="text-muted-foreground">
              Fades in while sliding down from above
            </p>
            <code className="block mt-2 p-2 bg-muted rounded text-sm">
              {`<SectionTransition variant="fade-down" duration={700}>`}
            </code>
          </div>
        </SectionTransition>

        {/* Fade Left Variant */}
        <SectionTransition variant="fade-left" duration={800}>
          <div className="p-6 bg-muted/50 rounded-lg border-2 border-muted">
            <h3 className="text-xl font-semibold mb-2">Fade Left Transition</h3>
            <p className="text-muted-foreground">
              Slides in from the right side
            </p>
            <code className="block mt-2 p-2 bg-muted rounded text-sm">
              {`<SectionTransition variant="fade-left" duration={800}>`}
            </code>
          </div>
        </SectionTransition>

        {/* Fade Right Variant */}
        <SectionTransition variant="fade-right" duration={800}>
          <div className="p-6 bg-muted/50 rounded-lg border-2 border-muted">
            <h3 className="text-xl font-semibold mb-2">Fade Right Transition</h3>
            <p className="text-muted-foreground">
              Slides in from the left side
            </p>
            <code className="block mt-2 p-2 bg-muted rounded text-sm">
              {`<SectionTransition variant="fade-right" duration={800}>`}
            </code>
          </div>
        </SectionTransition>

        {/* Zoom Variant */}
        <SectionTransition variant="zoom" duration={900}>
          <div className="p-6 bg-primary/5 rounded-lg border-2 border-primary/30">
            <h3 className="text-xl font-semibold mb-2">Zoom Transition</h3>
            <p className="text-muted-foreground">
              Scales up from slightly smaller size
            </p>
            <code className="block mt-2 p-2 bg-muted rounded text-sm">
              {`<SectionTransition variant="zoom" duration={900}>`}
            </code>
          </div>
        </SectionTransition>

        {/* Blur Variant */}
        <SectionTransition variant="blur" duration={1000}>
          <div className="p-6 bg-secondary/5 rounded-lg border-2 border-secondary/30">
            <h3 className="text-xl font-semibold mb-2">Blur Transition</h3>
            <p className="text-muted-foreground">
              Heavy blur that clears as it fades in
            </p>
            <code className="block mt-2 p-2 bg-muted rounded text-sm">
              {`<SectionTransition variant="blur" duration={1000}>`}
            </code>
          </div>
        </SectionTransition>
      </section>

      {/* Advanced Usage */}
      <section className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">Advanced Features</h2>
        
        <SectionTransition variant="fade-up" duration={800} delay={200}>
          <div className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg border-2 border-primary/30">
            <h3 className="text-xl font-semibold mb-2">Delayed Animation</h3>
            <p className="text-muted-foreground mb-2">
              Add delays to create staggered animations
            </p>
            <code className="block p-2 bg-muted rounded text-sm">
              {`<SectionTransition variant="fade-up" delay={200}>`}
            </code>
          </div>
        </SectionTransition>

        <SectionTransition variant="fade-up" duration={800} threshold={0.3}>
          <div className="p-6 bg-gradient-to-br from-accent/20 to-muted/20 rounded-lg border-2 border-accent/30">
            <h3 className="text-xl font-semibold mb-2">Custom Threshold</h3>
            <p className="text-muted-foreground mb-2">
              Control when animations trigger (0-1, default 0.1)
            </p>
            <code className="block p-2 bg-muted rounded text-sm">
              {`<SectionTransition threshold={0.3}>`}
            </code>
          </div>
        </SectionTransition>
      </section>

      {/* Best Practices */}
      <section className="max-w-4xl mx-auto space-y-6 pb-12">
        <SectionTransition variant="fade" duration={800}>
          <div className="p-8 bg-muted/30 rounded-xl border-2 border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Best Practices</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Use <code className="text-foreground">fade-up</code> for most sections - it's the most natural</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Keep durations between 600-1000ms for optimal feel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Add 100-200ms delays for staggered effects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Use <code className="text-foreground">zoom</code> for call-to-action sections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Combine with SmoothScroll and ScrollProgress for best UX</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Test on mobile devices - animations should feel smooth</span>
              </li>
            </ul>
          </div>
        </SectionTransition>
      </section>
    </div>
  );
}

