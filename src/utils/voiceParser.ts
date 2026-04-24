export interface VoiceCommand {
  type: "MOVE" | "ROTATE" | "STOP" | "AUTONOMOUS";
  params: any;
}

export function parseVoiceCommand(text: string): VoiceCommand | null {
  const input = text.toLowerCase();

  // Pattern: "go forward 30 cm" or "move forward 30"
  const moveMatch = input.match(/(?:go|move|forward|backwards|back|left|right)\s+(-?\d+)?/);
  if (moveMatch) {
    const value = parseInt(moveMatch[1] || "10");
    if (input.includes("forward")) return { type: "MOVE", params: { x: 0, z: value } };
    if (input.includes("back")) return { type: "MOVE", params: { x: 0, z: -value } };
    if (input.includes("left")) return { type: "MOVE", params: { x: -value, z: 0 } };
    if (input.includes("right")) return { type: "MOVE", params: { x: value, z: 0 } };
  }

  if (input.includes("stop") || input.includes("emergency")) {
    return { type: "STOP", params: {} };
  }

  if (input.includes("return to base") || input.includes("home")) {
    return { type: "AUTONOMOUS", params: { target: { x: 0, z: 0 } } };
  }

  return null;
}
