import { useEffect, useState, useRef } from "react";

export interface TypewriterProps {
  /**
   * Array of texts to display randomly
   */
  texts: string[];
  /**
   * Typing speed in milliseconds per character (default: 100)
   */
  typingSpeed?: number;
  /**
   * Deleting speed in milliseconds per character (default: 50)
   */
  deletingSpeed?: number;
  /**
   * Delay before starting to delete after typing completes (default: 2000)
   */
  pauseBeforeDelete?: number;
  /**
   * Delay before starting to type next text after deleting completes (default: 500)
   */
  pauseBeforeNext?: number;
  /**
   * Custom className for the container
   */
  className?: string;
}

/**
 * Typewriter Component
 *
 * Displays texts with typewriter effect: randomly selects a text, types it out character by character,
 * then deletes it character by character, and repeats with a new random text.
 * Includes a blinking cursor during typing and deleting.
 *
 * @example
 * ```tsx
 * <Typewriter texts={["Hello", "World"]} />
 * ```
 */
export default function Typewriter({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseBeforeDelete = 2000,
  pauseBeforeNext = 500,
  className = ""
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorBlinkRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize with a random text
  useEffect(() => {
    if (texts.length > 0) {
      const randomIndex = Math.floor(Math.random() * texts.length);
      setCurrentTextIndex(randomIndex);
      setDisplayedText("");
      setIsTyping(true);
      setIsDeleting(false);
    }
  }, [texts]);

  // Cursor blinking effect
  useEffect(() => {
    const blink = () => {
      setShowCursor((prev) => !prev);
    };

    cursorBlinkRef.current = setInterval(blink, 530);

    return () => {
      if (cursorBlinkRef.current) {
        clearInterval(cursorBlinkRef.current);
      }
    };
  }, []);

  // Typing and deleting logic
  useEffect(() => {
    if (texts.length === 0) return;

    const currentText = texts[currentTextIndex];

    if (isTyping && !isDeleting) {
      // Typing phase
      if (displayedText.length < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(currentText.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Typing complete, wait then start deleting
        timeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setIsDeleting(true);
        }, pauseBeforeDelete);
      }
    } else if (!isTyping && isDeleting) {
      // Deleting phase
      if (displayedText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, deletingSpeed);
      } else {
        // Deleting complete, select new random text and start typing
        timeoutRef.current = setTimeout(() => {
          // Get a random text index that's different from the current one
          let newIndex;
          if (texts.length === 1) {
            newIndex = 0;
          } else {
            do {
              newIndex = Math.floor(Math.random() * texts.length);
            } while (newIndex === currentTextIndex);
          }
          setCurrentTextIndex(newIndex);
          setIsDeleting(false);
          setIsTyping(true);
        }, pauseBeforeNext);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    displayedText,
    currentTextIndex,
    isTyping,
    isDeleting,
    texts,
    typingSpeed,
    deletingSpeed,
    pauseBeforeDelete,
    pauseBeforeNext
  ]);

  return (
    <span className={className}>
      {displayedText}
      <span className={showCursor ? "opacity-100" : "opacity-0"}>|</span>
    </span>
  );
}
