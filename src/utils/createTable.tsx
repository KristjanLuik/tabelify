import * as THREE from "three";

export default function createTable() {
    const table = new THREE.Group();

    const tabletopGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const tabletopMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
    const tabletop = new THREE.Mesh(tabletopGeometry, tabletopMaterial);
    table.add(tabletop);

    const legGeometry = new THREE.BoxGeometry(0.1, 0.9, 0.1);
    const legMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });

    const legPositions = [
        [-0.9, -0.5, -0.45],
        [0.9, -0.5, -0.45],
        [-0.9, -0.5, 0.45],
        [0.9, -0.5, 0.45]
    ];

    for (const position of legPositions) {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        // @ts-expect-error yes
        leg.position.set(...position);
        table.add(leg);
    }

    return table;
}