export class Pathfinder {

    constructor(
        navigationGrid
    ) {

        this.navigationGrid =
            navigationGrid;
    }


    // =========================
    // ENCONTRA CAMINHO
    // =========================

    findPath(
        startX,
        startY,
        targetX,
        targetY
    ) {

        const grid =
            this.navigationGrid;


        // =========================
        // CONVERTE COORDENADAS
        // =========================

        const start =
            grid.worldToGrid(
                startX,
                startY
            );


        let target =
            grid.worldToGrid(
                targetX,
                targetY
            );


        // =========================
        // START INVÁLIDO
        // =========================

        if (
            !grid.isInside(
                start.col,
                start.row
            )
        ) {

            return [];
        }


        // =========================
        // DESTINO BLOQUEADO
        // =========================

        if (
            !grid.isWalkable(
                target.col,
                target.row
            )
        ) {

            const nearest =
                this.findNearestWalkable(
                    target.col,
                    target.row
                );


            if (
                !nearest
            ) {

                return [];
            }


            target =
                nearest;
        }


        // =========================
        // START BLOQUEADO
        // =========================

        let actualStart =
            start;


        if (
            !grid.isWalkable(
                start.col,
                start.row
            )
        ) {

            const nearest =
                this.findNearestWalkable(
                    start.col,
                    start.row
                );


            if (
                !nearest
            ) {

                return [];
            }


            actualStart =
                nearest;
        }


        // =========================
        // A*
        // =========================

        const open = [];

        const closed =
            new Set();


        const startNode = {

            col:
                actualStart.col,

            row:
                actualStart.row,

            g:
                0,

            h:
                this.heuristic(
                    actualStart.col,
                    actualStart.row,
                    target.col,
                    target.row
                ),

            parent:
                null
        };


        startNode.f =
            startNode.g +
            startNode.h;


        open.push(
            startNode
        );


        while (
            open.length > 0
        ) {

            // =========================
            // MENOR F
            // =========================

            let bestIndex = 0;


            for (
                let i = 1;
                i < open.length;
                i++
            ) {

                if (
                    open[i].f <
                    open[bestIndex].f
                ) {

                    bestIndex = i;
                }
            }


            const current =
                open.splice(
                    bestIndex,
                    1
                )[0];


            // =========================
            // CHEGOU
            // =========================

            if (
                current.col ===
                    target.col &&
                current.row ===
                    target.row
            ) {

                return (
                    this.reconstructPath(
                        current
                    )
                );
            }


            closed.add(
                this.getKey(
                    current.col,
                    current.row
                )
            );


            // =========================
            // VIZINHOS
            // =========================

            const neighbors =
                this.getNeighbors(
                    current.col,
                    current.row
                );


            for (
                const neighbor
                of neighbors
            ) {

                const key =
                    this.getKey(
                        neighbor.col,
                        neighbor.row
                    );


                if (
                    closed.has(
                        key
                    )
                ) {

                    continue;
                }


                const moveCost =
                    neighbor.diagonal
                        ? Math.SQRT2
                        : 1;


                const newG =
                    current.g +
                    moveCost;


                const existing =
                    open.find(
                        (node) =>

                            node.col ===
                                neighbor.col &&

                            node.row ===
                                neighbor.row
                    );


                // =========================
                // JÁ EXISTE MELHOR
                // =========================

                if (
                    existing &&
                    newG >=
                        existing.g
                ) {

                    continue;
                }


                // =========================
                // ATUALIZA EXISTENTE
                // =========================

                if (
                    existing
                ) {

                    existing.g =
                        newG;

                    existing.h =
                        this.heuristic(
                            neighbor.col,
                            neighbor.row,
                            target.col,
                            target.row
                        );

                    existing.f =
                        existing.g +
                        existing.h;

                    existing.parent =
                        current;


                    continue;
                }


                // =========================
                // NOVO NODE
                // =========================

                const node = {

                    col:
                        neighbor.col,

                    row:
                        neighbor.row,

                    g:
                        newG,

                    h:
                        this.heuristic(
                            neighbor.col,
                            neighbor.row,
                            target.col,
                            target.row
                        ),

                    parent:
                        current
                };


                node.f =
                    node.g +
                    node.h;


                open.push(
                    node
                );
            }
        }


        // =========================
        // SEM CAMINHO
        // =========================

        return [];
    }


    // =========================
    // VIZINHOS
    // =========================

    getNeighbors(
        col,
        row
    ) {

        const grid =
            this.navigationGrid;


        const neighbors = [];


        // =========================
        // RETOS
        // =========================

        const straight = [

            {
                col: col + 1,
                row: row
            },

            {
                col: col - 1,
                row: row
            },

            {
                col: col,
                row: row + 1
            },

            {
                col: col,
                row: row - 1
            }
        ];


        for (
            const position
            of straight
        ) {

            if (
                grid.isWalkable(
                    position.col,
                    position.row
                )
            ) {

                neighbors.push({

                    col:
                        position.col,

                    row:
                        position.row,

                    diagonal:
                        false
                });
            }
        }


        // =========================
        // DIAGONAIS
        // =========================

        const diagonals = [

            {
                dx: 1,
                dy: 1
            },

            {
                dx: -1,
                dy: 1
            },

            {
                dx: 1,
                dy: -1
            },

            {
                dx: -1,
                dy: -1
            }
        ];


        for (
            const direction
            of diagonals
        ) {

            const nextCol =
                col +
                direction.dx;

            const nextRow =
                row +
                direction.dy;


            if (
                !grid.isWalkable(
                    nextCol,
                    nextRow
                )
            ) {

                continue;
            }


            // =========================
            // NÃO CORTA QUINA
            // =========================

            const horizontal =
                grid.isWalkable(
                    col +
                        direction.dx,

                    row
                );


            const vertical =
                grid.isWalkable(
                    col,

                    row +
                        direction.dy
                );


            if (
                !horizontal ||
                !vertical
            ) {

                continue;
            }


            neighbors.push({

                col:
                    nextCol,

                row:
                    nextRow,

                diagonal:
                    true
            });
        }


        return neighbors;
    }


    // =========================
    // HEURÍSTICA
    // =========================

    heuristic(
        col1,
        row1,
        col2,
        row2
    ) {

        const dx =
            Math.abs(
                col1 -
                col2
            );


        const dy =
            Math.abs(
                row1 -
                row2
            );


        // Octile distance.
        // Adequado para 8 direções.

        return (
            Math.max(
                dx,
                dy
            ) +

            (
                Math.SQRT2 -
                1
            ) *

            Math.min(
                dx,
                dy
            )
        );
    }


    // =========================
    // RECONSTRÓI CAMINHO
    // =========================

    reconstructPath(
        node
    ) {

        const path = [];


        let current =
            node;


        while (
            current
        ) {

            const world =
                this.navigationGrid
                    .gridToWorld(
                        current.col,
                        current.row
                    );


            path.push(
                world
            );


            current =
                current.parent;
        }


        path.reverse();


        // Remove a primeira célula,
        // pois normalmente é onde
        // o inimigo já está.

        if (
            path.length > 1
        ) {

            path.shift();
        }


        return path;
    }


    // =========================
    // CÉLULA LIVRE MAIS PRÓXIMA
    // =========================

    findNearestWalkable(
        startCol,
        startRow
    ) {

        const grid =
            this.navigationGrid;


        const maxRadius =
            10;


        for (
            let radius = 1;
            radius <= maxRadius;
            radius++
        ) {

            for (
                let row =
                    startRow - radius;

                row <=
                    startRow + radius;

                row++
            ) {

                for (
                    let col =
                        startCol - radius;

                    col <=
                        startCol + radius;

                    col++
                ) {

                    // Só testa a borda
                    // do quadrado atual.

                    const onBorder =
                        col ===
                            startCol -
                                radius ||

                        col ===
                            startCol +
                                radius ||

                        row ===
                            startRow -
                                radius ||

                        row ===
                            startRow +
                                radius;


                    if (
                        !onBorder
                    ) {

                        continue;
                    }


                    if (
                        grid.isWalkable(
                            col,
                            row
                        )
                    ) {

                        return {
                            col,
                            row
                        };
                    }
                }
            }
        }


        return null;
    }


    // =========================
    // CHAVE
    // =========================

    getKey(
        col,
        row
    ) {

        return (
            `${col},${row}`
        );
    }
}