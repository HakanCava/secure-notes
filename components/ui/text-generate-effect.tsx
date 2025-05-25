import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

interface TextGenerateEffectProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  erasingSpeed?: number;
  delayBeforeErasing?: number;
}

export function TextGenerateEffect({
  text,
  className = "",
  typingSpeed = 100,
  erasingSpeed = 50,
  delayBeforeErasing = 1000,
}: TextGenerateEffectProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blink effect
  useEffect(() => {
    let cursorInterval: ReturnType<typeof setInterval>;

    if (displayText.length === text.length && isTyping) {
      cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500); // Blink every 500ms
    } else {
      setShowCursor(true);
    }

    return () => {
      if (cursorInterval) clearInterval(cursorInterval);
    };
  }, [displayText, text, isTyping]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const animateText = () => {
      if (isTyping) {
        if (displayText.length < text.length) {
          // Typing forward
          timeoutId = setTimeout(() => {
            setDisplayText(text.slice(0, displayText.length + 1));
          }, typingSpeed);
        } else {
          // Finished typing, wait before erasing
          timeoutId = setTimeout(() => {
            setIsTyping(false);
          }, delayBeforeErasing);
        }
      } else {
        if (displayText.length > 0) {
          // Erasing
          timeoutId = setTimeout(() => {
            setDisplayText(text.slice(0, displayText.length - 1));
          }, erasingSpeed);
        } else {
          // Finished erasing, start typing again
          timeoutId = setTimeout(() => {
            setIsTyping(true);
          }, typingSpeed);
        }
      }
    };

    timeoutId = setTimeout(animateText, 0);

    return () => clearTimeout(timeoutId);
  }, [
    displayText,
    isTyping,
    text,
    typingSpeed,
    erasingSpeed,
    delayBeforeErasing,
  ]);

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 500 }}
    >
      <Text style={[styles.text, { color: "#64FFDA" }]} className={className}>
        {displayText}
        <Text style={[styles.text, { opacity: showCursor ? 0.8 : 0 }]}>|</Text>
      </Text>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
