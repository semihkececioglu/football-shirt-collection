import { useEffect } from "react";

export const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check for modifier keys
      const hasCtrl = event.ctrlKey || event.metaKey;
      const hasShift = event.shiftKey;
      const key = event.key.toLowerCase();

      shortcuts.forEach(({ keys, action, ctrl, shift }) => {
        const ctrlMatch = ctrl ? hasCtrl : !hasCtrl;
        const shiftMatch = shift ? hasShift : !hasShift;

        if (keys.includes(key) && ctrlMatch && shiftMatch) {
          event.preventDefault();
          action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [shortcuts]);
};
