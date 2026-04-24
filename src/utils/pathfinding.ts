// Simple A* Pathfinding for a grid
export interface Node {
  x: number;
  z: number;
  f: number;
  g: number;
  h: number;
  parent: Node | null;
}

export function findPath(start: { x: number, z: number }, end: { x: number, z: number }, obstacles: { x: number, z: number }[]): { x: number, z: number }[] {
  const openList: Node[] = [];
  const closedList: Node[] = [];

  const startNode: Node = { ...start, f: 0, g: 0, h: 0, parent: null };
  const endNode: Node = { ...end, f: 0, g: 0, h: 0, parent: null };

  openList.push(startNode);

  while (openList.length > 0) {
    let currentIndex = 0;
    for (let i = 0; i < openList.length; i++) {
      if (openList[i].f < openList[currentIndex].f) {
        currentIndex = i;
      }
    }

    const currentNode = openList[currentIndex];
    openList.splice(currentIndex, 1);
    closedList.push(currentNode);

    if (currentNode.x === endNode.x && currentNode.z === endNode.z) {
      const path = [];
      let curr = currentNode;
      while (curr !== null) {
        path.push({ x: curr.x, z: curr.z });
        curr = curr.parent!;
      }
      return path.reverse();
    }

    const neighbors = [
      { x: 0, z: 1 }, { x: 0, z: -1 }, { x: 1, z: 0 }, { x: -1, z: 0 }
    ];

    for (const offset of neighbors) {
      const neighborPos = { x: currentNode.x + offset.x, z: currentNode.z + offset.z };

      if (obstacles.some(obs => obs.x === neighborPos.x && obs.z === neighborPos.z)) continue;
      if (closedList.some(node => node.x === neighborPos.x && node.z === neighborPos.z)) continue;

      const g = currentNode.g + 1;
      const h = Math.abs(neighborPos.x - endNode.x) + Math.abs(neighborPos.z - endNode.z);
      const f = g + h;

      const existingOpen = openList.find(node => node.x === neighborPos.x && node.z === neighborPos.z);
      if (existingOpen && g >= existingOpen.g) continue;

      if (!existingOpen) {
        openList.push({ ...neighborPos, f, g, h, parent: currentNode });
      }
    }
  }

  return [];
}
