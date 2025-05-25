import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

interface TextGenerateEffectProps {
  text: string;
  className?: string;
}

export function TextGenerateEffect({
  text,
  className = "",
}: TextGenerateEffectProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 50); // Adjust speed here

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "timing", duration: 500 }}
    >
      <Text style={[styles.text, { color: "#64FFDA" }]} className={className}>
        {displayText}
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
