//Archivo de logica encargado del crear y analizar el grafo
class Grafo {
    constructor() {
        this.adyacente = new Map();
        this.estaciones = 0;
        this.rutas = 0;
        this.listaNodos = []
    }

    agregarNodo(nodo) { //funcion para agregar nodos
        if (!this.adyacente.has(nodo)) {
            this.adyacente.set(nodo, []);
            this.listaNodos.push(nodo);
        }
    }

    agregarArista(nodo, destino, peso) {//funcion para agregar aristas
        this.agregarNodo(nodo);
        this.agregarNodo(destino);
        this.adyacente.get(nodo).push({ destino, peso });
    }

    carga(archivo) { //Acá se recibe el contenido desde la UI
        try {
        this.adyacente = new Map(); // inicializo los valores cada vez que llamo
        this.estaciones = 0;
        this.rutas = 0;
        this.listaNodos = []

            const lineas = archivo.split('\n');
            lineas.forEach((linea, i) => {
                const fila = linea.trim().split(/\s+/);
                if (i == 0) {
                    this.estaciones = parseInt(fila[0], 10);
                    this.rutas = parseInt(fila[1], 10);
                } else {
                    this.agregarArista(fila[0], fila[1], parseInt(fila[2], 10));
                }
            });
        } catch (error) {
            console.error('Error al abrir el archivo:', error.message);
        }
    }

    mostrarGrafo() {
        for (const [id, aristas] of this.adyacente.entries()) {
            console.log(id, aristas);
        }
    }

    dijkstra(inicio, fin) { //Algoritmo de dijkstra
        const distancias = new Map();
        const anteriro = new Map();
        const visitados = new Set();
        const colaPriori = [];

        for (const nodo of this.adyacente.keys()) {
            distancias.set(nodo, Infinity);
            anteriro.set(nodo, null);
        }

        distancias.set(inicio, 0);
        colaPriori.push([inicio, 0]);

        while (colaPriori.length > 0) {
            colaPriori.sort((a, b) => a[1] - b[1]);

            let nodoActual = "";
            let distanciaActual = 0;

            const tope = colaPriori.shift();
            if (tope !== undefined) {
                nodoActual = tope[0];
                distanciaActual = tope[1];
            }

            if (!visitados.has(nodoActual)) {
                visitados.add(nodoActual);

                if (nodoActual == fin) {
                    break;
                }

                const nodosVecinos = this.adyacente.get(nodoActual);
                for (const arista of nodosVecinos) {
                    if (!visitados.has(arista.destino)) {
                        const distanciaNueva = distanciaActual + arista.peso;
                        if (distanciaNueva < distancias.get(arista.destino)) {
                            distancias.set(arista.destino, distanciaNueva);
                            anteriro.set(arista.destino, nodoActual);
                            colaPriori.push([arista.destino, distanciaNueva]);
                        }
                    }
                }
            }
        }

        return anteriro;
    }

    construirCamino(caminos, inicio, fin) { //Reconstrucción de camino
        let camino = [];
        let actual = fin;
        let costoFinal = 0;
        let p = 0;

        while (actual != inicio) {
            let anterior = caminos.get(actual);

            if (anterior == null) {
                return { pasos: [], costoFinal: Infinity }
            }
            const aristas = this.adyacente.get(anterior);
            aristas.forEach((arista) => {
                if (arista.destino == actual) {
                    p = arista.peso;
                }

            })
            camino.push({ anterior, actual, p })
            costoFinal += p;
            p = 0;
            actual = anterior;
        }
        camino.reverse();
        return {
            caminoFinal: camino,
            costoTotal: costoFinal
        };
    }
}


export default Grafo;