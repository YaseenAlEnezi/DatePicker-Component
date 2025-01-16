import { useEffect, useRef, useState } from "react";

function ScrollColumn({ options, initialIndex, onSelect }) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const scrollRef = useRef(null);

  // Add padding to the options for smoother scrolling
  const paddedOptions = [
    { value: "", label: "" },
    { value: "", label: "" },
    ...options,
    { value: "", label: "" },
    { value: "", label: "" },
  ];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const itemHeight = 64; // Height of each item in pixels

    // Function to handle scroll events
    const handleScroll = () => {
      const centerOffset = container.scrollTop + container.clientHeight / 2;
      const index = Math.round(centerOffset / itemHeight) - 2; // Adjust for padding

      if (index >= 0 && index < options.length && index !== selectedIndex) {
        setSelectedIndex(index);
        onSelect(options[index].value); // Call the onSelect callback with the selected value
      }
    };

    // Attach the scroll event listener
    container.addEventListener("scroll", handleScroll);

    // Scroll to the initial index on component mount
    container.scrollTo({
      top: (initialIndex + 2) * itemHeight - container.clientHeight / 2 + itemHeight / 2,
      behavior: "instant",
    });

    // Cleanup the event listener on unmount
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [selectedIndex, options, initialIndex, onSelect]);

  return (
    <div className="relative flex-1 h-[320px]">
      {/* Center line for selection */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-16 border-y border-gray-200 pointer-events-none" />
      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="h-full overflow-auto scroll-smooth scrollbar-hide"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      >
        <div className="space-y-4 snap-y">
          {paddedOptions.map((option, i) => (
            <div
              key={i}
              className={`text-center h-16 flex items-center justify-center snap-center ${
                i >= 2 &&
                i < paddedOptions.length - 2 &&
                i - 2 === selectedIndex
                  ? "text-black" // Highlight the selected item
                  : "text-gray-400" // Dim non-selected items
              }`}
            >
              <span className="text-xl">{option.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScrollColumn;