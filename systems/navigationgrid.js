export class NavigationGrid {

    constructor(
        mapWidth,
        mapHeight,
        walls,
        options = {}
    ) {

        // =========================
        // CONFIGURAÇÕES
        // =========================

        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        this.cellSize =
            options.cellSize ?? 40;

        // Margem extra em volta das paredes.
        // Deve considerar o tamanho do inimigo.
        this.padding =
            options.padding ?? 32;


        // =========================
        // TAMANHO DA GRID
        // =========================

        this.cols =
            Math.ceil(
                this.mapWidth /
                this.cellSize
            );

        this.rows =
            Math.ceil(
                this.mapHeight /
                this.cellSize
            );


        // =========================
        // CRIA GRID
        // =========================

        this.grid = [];

        for (
            let row = 0;
            row < this.rows;
            row++
        ) {

            this.grid[row] = [];

            for (
                let col = 0;
                col < this.cols;
                col++
            ) {

                this.grid[row][col] = 0;
            }
        }


        // =========================
        // MARCA PAREDES
        // =========================

        this.buildFromWalls(
            walls
        );
    }


    // =========================
    // CONSTRÓI GRID
    // =========================

    buildFromWalls(
        walls
    ) {

        if (
            !walls ||
            !walls.children
        ) {

            console.warn(
                "NavigationGrid: walls inválido."
            );

            return;
        }


        walls.children.iterate(
            (wall) => {

                if (
                    !wall ||
                    !wall.active
                ) {

                    return;
                }


                const bounds =
                    wall.getBounds();


                // =========================
                // EXPANDE A PAREDE
                // =========================

                const left =
                    bounds.left -
                    this.padding;

                const right =
                    bounds.right +
                    this.padding;

                const top =
                    bounds.top -
                    this.padding;

                const bottom =
                    bounds.bottom +
                    this.padding;


                // =========================
                // CONVERTE PARA GRID
                // =========================

                const startCol =
                    Math.floor(
                        left /
                        this.cellSize
                    );

                const endCol =
                    Math.floor(
                        right /
                        this.cellSize
                    );

                const startRow =
                    Math.floor(
                        top /
                        this.cellSize
                    );

                const endRow =
                    Math.floor(
                        bottom /
                        this.cellSize
                    );


                // =========================
                // BLOQUEIA CÉLULAS
                // =========================

                for (
                    let row = startRow;
                    row <= endRow;
                    row++
                ) {

                    for (
                        let col = startCol;
                        col <= endCol;
                        col++
                    ) {

                        if (
                            this.isInside(
                                col,
                                row
                            )
                        ) {

                            this.grid[row][col] = 1;
                        }
                    }
                }
            }
        );
    }


    // =========================
    // ESTÁ DENTRO DA GRID?
    // =========================

    isInside(
        col,
        row
    ) {

        return (
            col >= 0 &&
            row >= 0 &&
            col < this.cols &&
            row < this.rows
        );
    }


    // =========================
    // CÉLULA CAMINHÁVEL?
    // =========================

    isWalkable(
        col,
        row
    ) {

        if (
            !this.isInside(
                col,
                row
            )
        ) {

            return false;
        }


        return (
            this.grid[row][col] === 0
        );
    }


    // =========================
    // MUNDO -> GRID
    // =========================

    worldToGrid(
        x,
        y
    ) {

        return {

            col:
                Math.floor(
                    x /
                    this.cellSize
                ),

            row:
                Math.floor(
                    y /
                    this.cellSize
                )
        };
    }


    // =========================
    // GRID -> MUNDO
    // =========================

    gridToWorld(
        col,
        row
    ) {

        return {

            x:
                col *
                this.cellSize +
                this.cellSize / 2,

            y:
                row *
                this.cellSize +
                this.cellSize / 2
        };
    }

    // =========================
    // CÉLULAS ALCANÇÁVEIS
    // =========================

    getReachableCellsFrom(
        worldX,
        worldY
    ) {

        const start =
            this.worldToGrid(
                worldX,
                worldY
            );


        if (
            !this.isWalkable(
                start.col,
                start.row
            )
        ) {

            return [];
        }


        const reachable =
            [];


        const queue =
            [
                {
                    col: start.col,
                    row: start.row
                }
            ];


        const visited =
            new Set();


        visited.add(
            `${start.col},${start.row}`
        );


        // 8 direções, igual ao pathfinding.

        const directions =
            [
                { col: 0, row: -1 },
                { col: 1, row: 0 },
                { col: 0, row: 1 },
                { col: -1, row: 0 },

                { col: 1, row: -1 },
                { col: 1, row: 1 },
                { col: -1, row: 1 },
                { col: -1, row: -1 }
            ];


        while (
            queue.length > 0
        ) {

            const current =
                queue.shift();


            reachable.push(
                current
            );


            for (
                const direction
                of directions
            ) {

                const nextCol =
                    current.col +
                    direction.col;


                const nextRow =
                    current.row +
                    direction.row;


                if (
                    !this.isWalkable(
                        nextCol,
                        nextRow
                    )
                ) {

                    continue;
                }


                const key =
                    `${nextCol},${nextRow}`;


                if (
                    visited.has(
                        key
                    )
                ) {

                    continue;
                }


                // =====================
                // EVITA CORTAR QUINAS
                // =====================

                if (
                    direction.col !== 0 &&
                    direction.row !== 0
                ) {

                    const horizontalWalkable =
                        this.isWalkable(
                            current.col +
                            direction.col,
                            current.row
                        );


                    const verticalWalkable =
                        this.isWalkable(
                            current.col,
                            current.row +
                            direction.row
                        );


                    if (
                        !horizontalWalkable ||
                        !verticalWalkable
                    ) {

                        continue;
                    }
                }


                visited.add(
                    key
                );


                queue.push({

                    col:
                        nextCol,

                    row:
                        nextRow
                });
            }
        }


        return reachable;
    }
}