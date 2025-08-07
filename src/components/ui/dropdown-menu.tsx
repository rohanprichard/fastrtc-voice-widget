import * as React from 'react';

export type DropdownPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  position?: DropdownPosition;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const dropdownStyles = {
  container: {
    position: 'relative' as const,
    display: 'inline-block',
  },
  trigger: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#6b7280',
    transition: 'all 0.15s ease',
    outline: 'none',
  },
  triggerHover: {
    color: '#374151',
    background: 'rgba(0, 0, 0, 0.05)',
  },
  content: {
    position: 'fixed' as const,
    zIndex: 9999,
    minWidth: '240px',
    maxWidth: '320px',
    width: 'auto',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '4px',
    // Ensure isolation from parent styles
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    lineHeight: '1.4',
    color: '#374151',
    boxSizing: 'border-box' as const,
    transform: 'none',
    // Override any potential parent transformations
    margin: '0',
    left: 'auto',
    right: 'auto',
    top: 'auto',
    bottom: 'auto',
    // Mobile-specific styles
    '@media (max-width: 768px)': {
      minWidth: '200px',
      maxWidth: 'calc(100vw - 32px)',
      fontSize: '16px', // Prevent zoom on iOS
    } as any,
  },
  item: {
    display: 'block',
    width: '100%',
    padding: '6px 10px',
    fontSize: '13px',
    color: '#374151',
    background: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'background-color 0.15s ease',
    outline: 'none',
    lineHeight: '1.3',
  },
  itemHover: {
    background: '#f3f4f6',
  },
};

function getPositionStyles(triggerRect: DOMRect, position: DropdownPosition, menuWidth: number = 240) {
  const gap = 4;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isMobile = viewportWidth <= 768;
  
  // On mobile, use a more centered approach and ensure menu fits
  if (isMobile) {
    const mobileMenuWidth = Math.min(menuWidth, viewportWidth - 32); // 16px margin on each side
    const centerX = triggerRect.left + (triggerRect.width / 2);
    const leftPos = Math.max(16, Math.min(centerX - (mobileMenuWidth / 2), viewportWidth - mobileMenuWidth - 16));
    
    // Determine if menu should open up or down based on available space
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const estimatedMenuHeight = 200; // Approximate menu height
    
    if (spaceBelow >= estimatedMenuHeight || spaceBelow >= spaceAbove) {
      // Open downward
      return {
        left: leftPos,
        top: triggerRect.bottom + gap,
        width: mobileMenuWidth,
        maxHeight: Math.min(300, spaceBelow - gap - 16),
        overflowY: 'auto' as const,
      };
    } else {
      // Open upward
      return {
        left: leftPos,
        bottom: viewportHeight - triggerRect.top + gap,
        width: mobileMenuWidth,
        maxHeight: Math.min(300, spaceAbove - gap - 16),
        overflowY: 'auto' as const,
      };
    }
  }
  
  // Desktop positioning with boundary checks
  let styles: React.CSSProperties = {};
  
  switch (position) {
    case 'top':
      styles = {
        left: triggerRect.left + (triggerRect.width / 2),
        bottom: viewportHeight - triggerRect.top + gap,
        transform: 'translateX(-50%)',
      };
      // Ensure menu doesn't go off-screen horizontally
      const leftBound = Math.max(8, triggerRect.left + (triggerRect.width / 2) - (menuWidth / 2));
      const rightBound = Math.min(viewportWidth - menuWidth - 8, leftBound);
      if (rightBound !== leftBound) {
        styles.left = rightBound;
        styles.transform = 'none';
      }
      break;
      
    case 'top-left':
      styles = {
        right: Math.max(8, viewportWidth - triggerRect.right),
        bottom: viewportHeight - triggerRect.top + gap,
      };
      break;
      
    case 'top-right':
      styles = {
        left: Math.min(triggerRect.left, viewportWidth - menuWidth - 8),
        bottom: viewportHeight - triggerRect.top + gap,
      };
      break;
      
    case 'bottom':
      styles = {
        left: triggerRect.left + (triggerRect.width / 2),
        top: triggerRect.bottom + gap,
        transform: 'translateX(-50%)',
      };
      // Ensure menu doesn't go off-screen horizontally
      const leftBoundBottom = Math.max(8, triggerRect.left + (triggerRect.width / 2) - (menuWidth / 2));
      const rightBoundBottom = Math.min(viewportWidth - menuWidth - 8, leftBoundBottom);
      if (rightBoundBottom !== leftBoundBottom) {
        styles.left = rightBoundBottom;
        styles.transform = 'none';
      }
      break;
      
    case 'bottom-left':
      styles = {
        right: Math.max(8, viewportWidth - triggerRect.right),
        top: triggerRect.bottom + gap,
      };
      break;
      
    case 'bottom-right':
    default:
      styles = {
        left: Math.min(triggerRect.left, viewportWidth - menuWidth - 8),
        top: triggerRect.bottom + gap,
      };
      break;
  }
  
  // Add max height and scroll for desktop too if needed
  const availableHeight = position.includes('top') 
    ? triggerRect.top - gap - 8
    : viewportHeight - triggerRect.bottom - gap - 8;
    
  if (availableHeight < 300) {
    styles.maxHeight = Math.max(150, availableHeight);
    styles.overflowY = 'auto';
  }
  
  return styles;
}

export function DropdownMenu({ trigger, children, className, position = 'bottom-right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [positionStyles, setPositionStyles] = React.useState<React.CSSProperties>({});
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) &&
          contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      // Support both mouse and touch events for mobile
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('touchstart', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  React.useEffect(() => {
    function updatePosition() {
      if (isOpen && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Use actual menu width if available, otherwise use default
        const menuWidth = contentRef.current?.offsetWidth || 240;
        const styles = getPositionStyles(rect, position, menuWidth);
        setPositionStyles(styles);
      }
    }

    function handleResize() {
      if (isOpen) {
        updatePosition();
      }
    }

    function handleOrientationChange() {
      if (isOpen) {
        // Small delay to account for orientation change
        setTimeout(updatePosition, 100);
      }
    }

    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleOrientationChange);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
      };
    }
  }, [isOpen, position]);

  const triggerStyle = {
    ...dropdownStyles.trigger,
    ...(isHovered ? dropdownStyles.triggerHover : {}),
  };

  const contentStyle = {
    ...dropdownStyles.content,
    ...positionStyles,
  };

  return (
    <>
      <div ref={containerRef} style={dropdownStyles.container} className={className}>
        <button
          style={triggerStyle}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {trigger}
        </button>
      </div>
      {isOpen && (
        <div ref={contentRef} style={contentStyle}>
          {children}
        </div>
      )}
    </>
  );
}

export function DropdownMenuItem({ children, onClick, className }: DropdownMenuItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const itemStyle = {
    ...dropdownStyles.item,
    ...(isHovered ? dropdownStyles.itemHover : {}),
  };

  return (
    <button
      style={itemStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className={className}
    >
      {children}
    </button>
  );
}