// =========================
// SOFÁ INICIAL
// =========================

export const SPAWN_SOFA = {

    id:
        "spawnSofa",

    x:
        163,

    y:
        151,

    width:
        96,

    height:
        67,

    exitPadding:
        12,

    playerSpawnX:
        211,

    playerSpawnY:
        181
};


// =========================
// COLISÕES DO BUILDING 3
// COORDENADAS NA ESCALA ORIGINAL
// =========================

export const MAP_WALLS = [

    // =========================
    // LIMITES UNIVERSAIS DO MAPA
    // MAPA ORIGINAL: 1672 x 941
    // =========================

    // Parede superior completa

    {
        id: "mapWallTop",

        x: 25,
        y: 30,

        width: 1625,
        height: 20
    },


    // Parede esquerda completa

    {
        id: "mapWallLeft",

        x: 25,
        y: 30,

        width: 20,
        height: 885
    },

    //parede inferior completa

    {
        id: "mapWallBottom",

        x: 25,
        y: 895,

        width: 1625,
        height: 20
    },

    // Parede direita completa

    {
        id: "mapWallRight",

        x: 1630,
        y: 30,

        width: 20,
        height: 885
    },

    // =========================
    // SALA DE DESCANSO
    // BANCADA, PIA E MÁQUINAS
    // =========================

    {
        id: "restKitchen",

        x: 118,
        y: 52,

        width: 390,
        height: 68
    },


    // Armários, bebedouro e objetos
    // encostados na parede esquerda.

    {
        id: "restLeftCabinets",

        x: 41,
        y: 149,

        width: 53,
        height: 210
    },


    // =========================
    // SOFÁS
    // O sofá inicial é criado
    // separadamente.
    // =========================

    {
        id: "restLeftSofa",

        x: 121,
        y: 194,

        width: 55,
        height: 91
    },

    {
        id: "restRightSofa",

        x: 299,
        y: 194,

        width: 56,
        height: 91
    },

    {
        id: "restLowerSofa",

        x: 157,
        y: 274,

        width: 108,
        height: 60
    },


    // =========================
    // MESA ENTRE OS SOFÁS
    // =========================

    {
        id: "restCoffeeTable",

        x: 184,
        y: 207,

        width: 70,
        height: 65
    },


    // =========================
    // MESAS REDONDAS
    // =========================

    {
        id: "restRoundTableTop",

        x: 395,
        y: 148,

        width: 73,
        height: 79
    },

    {
        id: "restRoundTableBottom",

        x: 392,
        y: 272,

        width: 76,
        height: 79
    },


    // =========================
    // ESCADA DESTRUÍDA
    // =========================

    {
        id: "restBlockedStairs",

        x: 53,
        y: 365,

        width: 90,
        height: 123
    },


    // =========================
    // MESA INFERIOR
    // =========================

    {
        id: "restLowerDesk",

        x: 218,
        y: 430,

        width: 88,
        height: 74
    },


    // =========================
    // SOFÁ INFERIOR
    // =========================

    {
        id: "restBottomSofa",

        x: 219,
        y: 546,

        width: 105,
        height: 53
    },

    // =========================
    // DECORAÇÃO SUPERIOR ESQUERDA
    // Formato em L usando dois blocos.
    // =========================

    {
        id: "restTopLeftDecorTop",

        x: 35,
        y: 40,

        width: 90,
        height: 65
    },

    {
        id: "restTopLeftDecorSide",

        x: 35,
        y: 78,

        width: 35,
        height: 73
    },


    // =========================
    // POLTRONAS SOLTAS
    // Duas colisões pequenas para
    // não bloquear toda a passagem.
    // =========================

    {
        id: "restLooseChairTop",

        x: 289,
        y: 340,

        width: 40,
        height: 35
    },

    {
        id: "restLooseChairBottom",

        x: 321,
        y: 360,

        width: 40,
        height: 45
    },


    // =========================
    // ARMÁRIO LATERAL INFERIOR
    // =========================

    {
        id: "restLowerRightCabinet",

        x: 351,
        y: 455,

        width: 50,
        height: 140
    },

    // =========================
    // PAREDES DA SALA DE DESCANSO
    // =========================

    // Parede direita superior

    {
        id: "restWallRightTop",

        x: 514,
        y: 29,

        width: 16,
        height: 150
    },

    // Parede direita inferior

    {
        id: "restWallRightBottom",

        x: 514,
        y: 220,

        width: 16,
        height: 200
    },


    // Parede horizontal acima
    // da sala lateral inferior.

    {
        id: "restWallRightHorizontal",

        x: 390,
        y: 389,

        width: 140,
        height: 50
    },


    // Parede vertical ao lado
    // do armário inferior.

    {
        id: "restWallInnerRight",

        x: 389,
        y: 389,

        width: 16,
        height: 208
    },


    // Parede inferior principal

    {
        id: "restWallBottom",

        x: 177,
        y: 595,

        width: 229,
        height: 50
    },


    // Pequeno trecho inferior esquerdo.
    // O espaço seguinte fica aberto
    // para servir como passagem.

    {
        id: "restWallBottomLeft",

        x: 39,
        y: 520,

        width: 50,
        height: 110
    },

    // parede inferior direita

    {
        id: "restWallBottomRight",

        x: 139,
        y: 520,

        width: 55,
        height: 110
    },

    // =========================
    // ESCRITÓRIOS SUPERIORES
    // DIVISÓRIAS VERTICAIS
    // =========================

    {
        id: "upperOfficeWallLeft",

        x: 595,
        y: 30,

        width: 30,
        height: 215
    },

    {
        id: "upperOfficeDivider1",

        x: 731,
        y: 30,

        width: 18,
        height: 142
    },

    {
        id: "upperOfficeDivider2",

        x: 871,
        y: 30,

        width: 18,
        height: 142
    },

    {
        id: "upperOfficeDivider3",

        x: 1001,
        y: 30,

        width: 18,
        height: 142
    },

    {
        id: "upperOfficeWallRight",

        x: 1118,
        y: 30,

        width: 60,
        height: 215
    },

    // =========================
    // ESCRITÓRIO SUPERIOR 1
    // =========================

    {
        id: "upperOffice1Desk",

        x: 631,
        y: 59,

        width: 55,
        height: 78
    },

    {
        id: "upperOffice1BottomFurniture",

        x: 621,
        y: 168,

        width: 70,
        height: 26
    },

    // =========================
    // ESCRITÓRIO SUPERIOR 2
    // =========================

    {
        id: "upperOffice2Desk",

        x: 748,
        y: 59,

        width: 79,
        height: 79
    },

    {
        id: "upperOffice2BottomFurniture",

        x: 738,
        y: 168,

        width: 100,
        height: 26
    },

    // =========================
    // ESCRITÓRIO SUPERIOR 3
    // =========================

    {
        id: "upperOffice3Desk",

        x: 890,
        y: 58,

        width: 70,
        height: 80
    },

    {
        id: "upperOffice3BottomFurniture",

        x: 880,
        y: 168,

        width: 80,
        height: 27
    },

    // =========================
    // ESCRITÓRIO SUPERIOR 4
    // =========================

    {
        id: "upperOffice4Desk",

        x: 1010,
        y: 59,

        width: 78,
        height: 79
    },

    {
        id: "upperOffice4BottomFurniture",

        x: 1000,
        y: 168,

        width: 90,
        height: 27
    },

    // =========================
    // ARMÁRIOS DO CORREDOR SUPERIOR
    // =========================

    {
        id: "upperHallCabinetLeft",

        x: 612,
        y: 243,

        width: 195,
        height: 42
    },

    {
        id: "upperHallCabinetCenter",

        x: 875,
        y: 241,

        width: 146,
        height: 40
    },

    {
        id: "upperHallCabinetRight",

        x: 1090,
        y: 241,

        width: 140,
        height: 33
    },

    // =========================
    // SALA DE REUNIÃO SUPERIOR
    // =========================

    // Mesa grande junto com as cadeiras.
    // Uma colisão única evita que o player
    // fique preso entre mesa e cadeiras.

    {
        id: "meetingRoomTable",

        x: 1210,
        y: 85,

        width: 150,
        height: 125
    },


    // Parede direita da sala de reunião.
    // Também separa a sala da escadaria.

    {
        id: "meetingRoomWallRight",

        x: 1400,
        y: 30,

        width: 35,
        height: 215
    },


    // Armário inferior voltado para o corredor.

    {
        id: "meetingRoomBottomCabinet",

        x: 1307,
        y: 242,

        width: 128,
        height: 33
    },

    // =========================
    // ESCADARIA SUPERIOR DIREITA
    // =========================

    // Parte horizontal interna da escada.

    {
        id: "stairsInnerTop",

        x: 1434,
        y: 165,

        width: 112,
        height: 18
    },


    // Parede vertical interna.

    {
        id: "stairsInnerSide",

        x: 1532,
        y: 165,

        width: 18,
        height: 112
    },


    // Parede inferior direita.
    // O lado esquerdo permanece aberto
    // para permitir acesso à escadaria.

    {
        id: "stairsBottomRight",

        x: 1532,
        y: 267,

        width: 100,
        height: 18
    },

    // =========================
    // BLOCO LATERAL DIREITO
    // BANHEIROS E SERVIDORES
    // =========================

    // Parede superior

    {
        id: "eastBlockWallTop",

        x: 1398,
        y: 334,

        width: 234,
        height: 18
    },


    // Parede esquerda

    {
        id: "eastBlockWallLeft",

        x: 1398,
        y: 334,

        width: 18,
        height: 385
    },


    // Parede inferior

    {
        id: "eastBlockWallBottom",

        x: 1398,
        y: 701,

        width: 234,
        height: 18
    },

    // =========================
    // SALA DE REUNIÃO INFERIOR
    // =========================

    // Móveis e decoração da parede esquerda

    {
        id: "lowerMeetingLeftDecor",

        x: 1358,
        y: 755,

        width: 42,
        height: 140
    },


    // Armário superior esquerdo

    {
        id: "lowerMeetingTopCabinetLeft",

        x: 1450,
        y: 755,

        width: 70,
        height: 21
    },


    // Armário superior direito

    {
        id: "lowerMeetingTopCabinetRight",

        x: 1565,
        y: 755,

        width: 70,
        height: 21
    },


    // Mesa central junto com as cadeiras

    {
        id: "lowerMeetingTable",

        x: 1420,
        y: 795,

        width: 145,
        height: 75
    },


    // Plantas e móveis da parede direita

    {
        id: "lowerMeetingRightDecor",

        x: 1605,
        y: 755,

        width: 17,
        height: 140
    },

    // =========================
    // BLOCO CENTRAL ESQUERDO
    // =========================

    // Armários verticais superiores

    {
        id: "centralWestCabinet",

        x: 600,
        y: 330,

        width: 65,
        height: 215
    },


    // Parede longa da lateral esquerda

    {
        id: "centralWestBoundaryLeft",

        x: 492,
        y: 495,

        width: 50,
        height: 400
    },


    // Parede horizontal superior

    {
        id: "centralWestBoundaryTop",

        x: 492,
        y: 495,

        width: 166,
        height: 50
    },

    // Elevador destruído.
    // O interior inteiro fica bloqueado.

    {
        id: "centralElevatorShaft",

        x: 700,
        y: 350,

        width: 135,
        height: 185
    },

    // =========================
    // RECEPÇÃO CENTRAL
    // =========================

    {
        id: "centralReceptionTop",

        x: 885,
        y: 340,

        width: 145,
        height: 36
    },

    {
        id: "centralReceptionLeft",

        x: 885,
        y: 340,

        width: 40,
        height: 170
    },

    {
        id: "centralReceptionBottom",

        x: 885,
        y: 460,

        width: 125,
        height: 75
    },

    // =========================
    // SALAS CENTRAIS DIREITAS
    // =========================

    // Plantas e parede superior esquerda

    {
        id: "centralLoungeTopDecor",

        x: 1055,
        y: 335,

        width: 30,
        height: 81
    },


    // Poltronas e mesa redonda

    {
        id: "centralLoungeFurniture",

        x: 1128,
        y: 365,

        width: 70,
        height: 150
    },

    // Plantas inferiores da sala pequena

    {
        id: "centralLoungeBottomDecor",

        x: 1055,
        y: 458,

        width: 30,
        height: 73
    },


    // Mesa e cadeiras da sala de reunião

    {
        id: "centralMeetingTable",

        x: 1230,
        y: 390,

        width: 65,
        height: 102
    },

    //parede lateral direita da sala de reunião

    {
        id: "centralMeetingWallRight",

        x: 1325,
        y: 335,

        width: 18,
        height: 162
    },

    // parede superior esquerda da sala de reunião

    {
        id: "centralMeetingWallLeftTop",

        x: 1185,
        y: 335,

        width: 40,
        height: 30
    },

    // parede superior direita da sala de reunião

    {
        id: "centralMeetingWallRightTop",

        x: 1270,
        y: 335,

        width: 55,
        height: 30
    },

    // Armários e parede inferior das duas salas

    {
        id: "centralRoomsBottomCabinets",

        x: 1060,
        y: 490,

        width: 280,
        height: 40
    },

    // =========================
    // ESCRITÓRIOS CENTRAIS
    // PRIMEIRA FILEIRA
    // =========================

    {
        id: "centralOfficeUpper1",

        x: 600,
        y: 580,

        width: 65,
        height: 150
    },

    {
        id: "centralOfficeUpper2",

        x: 700,
        y: 585,

        width: 105,
        height: 145
    },

    {
        id: "centralOfficeUpper3",

        x: 850,
        y: 580,

        width: 70,
        height: 150
    },

    {
        id: "centralOfficeUpper4",

        x: 955,
        y: 580,

        width: 180,
        height: 150
    },

    {
        id: "centralOfficeUpper5",

        x: 1185,
        y: 590,

        width: 115,
        height: 135
    },

    // =========================
    // ESCRITÓRIOS CENTRAIS
    // SEGUNDA FILEIRA
    // =========================

    {
        id: "centralOfficeLower1",

        x: 600,
        y: 765,

        width: 215,
        height: 130
    },

    {
        id: "centralOfficeLower2",

        x: 880,
        y: 765,

        width: 70,
        height: 130
    },

    {
        id: "centralOfficeLower3",

        x: 985,
        y: 765,

        width: 115,
        height: 130
    },

    {
        id: "centralOfficeLower4",

        x: 1160,
        y: 765,

        width: 140,
        height: 130
    },

    // =========================
    // ESCADARIA INFERIOR ESQUERDA
    // =========================

    // Parede superior da escadaria

    {
        id: "lowerStairsWallTop",

        x: 40,
        y: 690,

        width: 215,
        height: 18
    },


    // Parede direita superior

    {
        id: "lowerStairsWallRightTop",

        x: 235,
        y: 690,

        width: 18,
        height: 95
    },


    // Parede direita inferior

    {
        id: "lowerStairsWallRightBottom",

        x: 235,
        y: 830,

        width: 18,
        height: 65
    },

    // =========================
    // CONTORNO INTERNO DA ESCADA
    // =========================

    {
        id: "lowerStairsInnerTop",

        x: 145,
        y: 735,

        width: 88,
        height: 18
    },

    {
        id: "lowerStairsInnerLeft",

        x: 145,
        y: 735,

        width: 18,
        height: 102
    },

    {
        id: "lowerStairsInnerBottom",

        x: 145,
        y: 819,

        width: 105,
        height: 18
    },

    // =========================
    // SALA DE MANUTENÇÃO
    // =========================

    // Parede superior esquerda

    {
        id: "maintenanceWallTopLeft",

        x: 305,
        y: 690,

        width: 125,
        height: 200
    },


    // Pequeno trecho superior direito.
    // O vão entre os dois trechos é a entrada.

    {
        id: "maintenanceWallTopRight",

        x: 470,
        y: 690,

        width: 22,
        height: 18
    },

];