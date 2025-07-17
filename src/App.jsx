//Este archivo contiene toda parte grafica, se definen contenedores, botones y demas componentes
//

import { useState, useRef } from 'react'
import './App.css'
import Grafo from "./utils/logica";
import Grafica from "./components/Grafica"
import { ReactFlow } from '@xyflow/react';



function App() {
  //Seccion de definicion de constantes y sus respectivos setters
  //con useState monotoreo su estado
  const grafo = useRef(new Grafo());
  const [nodosGrafica, setNodosGrafica] = useState([]);
  const [aristasGrafica, setAristasGrafica] = useState([]);
  const [cargaCompletada, setCargaCompletada] = useState(false);
  const [grafosCargados, setGrafos] = useState(null);
  const inputRef = useRef(null);
  const [listaNodos, setListaNodos] = useState([]);
  const [nodoOrigen, setNodoOrigen] = useState("");
  const [nodoDestino, setNodoDestino] = useState("");
  const [rutaCalculada, setRutaCalculada] = useState({});
  const [graficaKey, setGraficaKey] = useState(0);
  const [nombreArch, setNombreArch] = useState("");
  const [archivoBlob, setArchivoBlob] = useState(null);
  const [estBotonTxt, setEstBotonTxt] = useState(false);

  //Funcion del input para Carga de archivo desde el navegador
  const handleFileChange = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) {
      return
    }
    const lector = new FileReader();
    lector.onload = (event) => {

      if (listaNodos.length > 0) { //Reinicio valores para cada nueva carga
        setNodosGrafica([]);
        setAristasGrafica([]);
        setCargaCompletada(false);
        setGrafos(null);
        setListaNodos([]);
        setNodoOrigen("Origen");
        setNodoDestino("Destino");
        setRutaCalculada({});
        setGraficaKey(prevKey => prevKey + 1);
        setNombreArch("");
        setArchivoBlob(null);
        setEstBotonTxt(false);
        grafo.current = new Grafo();

      }
      //recibo contenido y lo envio a mi archivo logica.js
      const entrada = event.target.result;
      grafo.current.carga(entrada);
      setGrafos([...grafo.current.adyacente])
      grafo.current.mostrarGrafo();
      setListaNodos([...grafo.current.listaNodos]);

      if (listaNodos.length > 0) {
        setNodoOrigen('Origen')
        setNodoDestino('Destino')
      }

      const nodosGrafica = [];
      const aristasGrafica = [];
      const grafoActual = [...grafo.current.adyacente];
      setGrafos(grafoActual);

      //calculo para posicionar nodos
      const radio = 300;
      const centrox = 400;
      const centroy = 300;
      const divi = grafoActual.length


      grafoActual.forEach(([nodo, vecinos], i) => {

        const angulo = (2 * Math.PI * i) / divi;
        const xi = centrox + radio * Math.cos(angulo);
        const yi = centroy + radio * Math.sin(angulo);

        console.log(`x=${xi} y =${yi}`)
        nodosGrafica.push({
          id: nodo,
          position: { x: xi, y: yi, }
        }); // Aca lleno el arreglo de nodos que sera enviado para graficar

        vecinos.forEach(vecino => {
          aristasGrafica.push({
            origen: nodo,
            destino: vecino.destino,
            peso: vecino.peso
          });
        });//Aca lleno mi arreglo de aristas que sera enviado para graficar
      });

      setAristasGrafica(aristasGrafica);
      setNodosGrafica(nodosGrafica)
      setCargaCompletada(true)

    }
    lector.readAsText(archivo);
  };

  function handleClickCarga() {
    inputRef.current.click();
  }

  function handleOrigenChange(event) {
    setNodoOrigen(event.target.value)
  }

  function handleDestinoChange(event) {
    setNodoDestino(event.target.value)
  }

  function calculaRuta() {
    console.log(`Nodo origen ${nodoOrigen}`)
    console.log(`Nodo Destino ${nodoDestino}`)
    const caminos = grafo.current.dijkstra(nodoOrigen, nodoDestino);
    console.log("caminos");
    console.log(caminos);
    console.log("Esos fueron los caminos")
    const ruta = grafo.current.construirCamino(caminos, nodoOrigen, nodoDestino);
    console.log('Ruta:');
    console.log(ruta);

    //Agrego la propiedad que me indica que una arista y nodo forman parte del camino optimo
    const nuevaAristas = aristasGrafica.map(arista => {
      let esRuta = false;
      for (let paso of ruta.caminoFinal) {
        if (String(paso.anterior) == String(arista.origen) && String(paso.actual) == String(arista.destino) && Number(paso.p) == Number(arista.peso)) {
          console.log(`Coinicencia de aristas`);
          esRuta = true;
          break;
        }
      }
      return {
        ...arista,
        escamino: esRuta ? 'si' : undefined
      };


    });
    const estadoBoton = true
    //extraigo el contenido para la salida en archivo
    const contenidoDescarga = (() => {
      let conteni = "Ruta Optima:\n";
      if (ruta && ruta.caminoFinal && ruta.caminoFinal.length > 0) {

        ruta.caminoFinal.forEach((paso) => (
          conteni += `Estacion ${paso.anterior} --> Estacion ${paso.actual} : Costo(${paso.p})\n\n`
        ))
        conteni += `\t\t\tCosto Total = ${ruta.costoTotal}\n`;

      } else {
        conteni += "No se encontro una ruta ";
      }
      return conteni;
    })();
    //creacion del Blob para generar el archivo de texto
    const archBlob = new Blob([contenidoDescarga], { type: 'text/plain' });
    const nombArch = `Ruta-Optima-de-nodo-${nodoOrigen}-a-nodo-${nodoDestino}.txt`
    setEstBotonTxt(estadoBoton)
    setArchivoBlob(archBlob);
    setNombreArch(nombArch);

    setAristasGrafica(nuevaAristas);
    setGraficaKey(prev => prev + 1);
    console.log('esa fue la ruta:');
    setRutaCalculada({ ...ruta });
    console.log(rutaCalculada);
  }

  return (//Inicia la construccion de lo elementos graficos
    <>
      <div className='header'>
        <h3>Programa Para el Manejo de Grafos  por Enderson Chavez</h3>
      </div>
      {/* Parte Bloque de Container superior */}
      <div className='container-sup'>

        <div className='cont-sup-left'>
            
            <h1>Análisis y Optimización</h1>
            <p>Calcula la ruta <strong>optima</strong> <br />
              Llega más rápido y economisa recursos... <br />
              </p>
            <button className='button-cargar' onClick={handleClickCarga}>
              Cargar Grafo
            </button>
            <input
              type="file"
              accept=".in,.txt"
              ref={inputRef}
              onChange={handleFileChange}
            />
        </div>

        <div className='cont-sup-right'>

            <div className='muestra-grafo-cargado'>
              {grafosCargados == null ? (
                <>
                  {/* Instrucciones */}
                  <div className='caja-scroll-0'>
                    <h2>Comencemos</h2>
                    <p>
                      Analiza una <strong>red de transporte </strong>
                      metros,
                      autobuses... y obtenga las rutas óptimas entre diferentes estaciones o puntos.
                      <br /><br />
                      Solo debes cargar un archivo <strong>.txt</strong> o <strong>.in </strong>
                      con el siguiente formato: <hr />
                      <strong>4 3 <br />
                        1 2 10 <br />
                        1 3 30 <br />
                        2 4 20 </strong><hr />
                      En la primera línea se indica número de estaciones y de rutas
                      y luego en cada línea una ruta diferente en este orden nodo de origen, nodo destino y peso


                    </p>
                  </div>
                </>

              ) : (
                <>
                {/*Acá de muestra los datos del grafo */}
                  <div className='grafos-carg'>
                    <h2>Grafo Cargado</h2>
                  </div>
                  <div className='caja-scroll'>
                    {grafosCargados.map(([nodo, vecinos]) => (

                      <div key={nodo} className='nodosCargados'>
                        <strong>{nodo}:</strong>{"  "}

                        {vecinos.map((vecino, i) => (
                          <span key={i}>

                            {vecino.destino} ({vecino.peso})
                            {i < vecinos.length - 1 ? ", " : "."}
                          </span>

                        ))}
                        <br />

                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>
            <div className='campo-consulta'>
              {/* Aca se consulta el nodo de destino y el de origen */}
              <label>
                <h2>Nodos de Interes</h2>

                <select value={nodoOrigen} onChange={handleOrigenChange} >
                  <option key={'ori'} value={null}>{'Origen'}</option>
                  {listaNodos.map((nod, i) => (
                    <option key={i} value={nod}>{nod}</option>
                  ))};
                </select>

                <select value={nodoDestino} onChange={handleDestinoChange} >
                  <option key={'des'} value={null}>{'Destino'}</option>
                  {listaNodos.map((nod, i) => (
                    <option key={i} value={nod}>{nod}</option>

                  ))};
                </select>
                <br />
              </label>

            {/* Se muestran datos como ruta, caminos */}
            </div>
            <div className='calcular-sd'>
              <div className='calcular-sd-izq'>
                <div className='calcular-sd-izq-sup'>
                  <h4>Nodos registrados</h4>
                  {grafosCargados == null ? (
                    <h1>0</h1>
                  ) : (
                    <h1>{grafosCargados.length}</h1>
                  )

                  }
                </div>
                <div className='calcular-sd-izq-inf'>
                  <h4>Rutas registradas</h4>
                  {grafosCargados == null ? (
                    <h1>0</h1>
                  ) : (
                    <h1>{aristasGrafica.length}</h1>
                  )

                  }
                </div>
              </div>
                  {/* Boton calcular */}
              <div className='calcular-sd-der'>
                <button className='button-calcular' onClick={calculaRuta} disabled={nodoDestino == nodoOrigen}>
                  Calcular Ruta
                  {console.log(rutaCalculada)}
                </button>
              </div>


            </div>
        </div>
      </div >
      {/* Parte Bloque de Container inferior */}
      <br /><br /><br />
      <div className='container-infe'>
          <div className='cont-infe-left'>
            {/* Aca se llama al componete grafica que se encarga de mostrar el grafo */}
            {cargaCompletada && (
              <Grafica key={graficaKey} nodosLista={nodosGrafica} conexionesLista={aristasGrafica} />
            )}

          </div>
          <div className='cont-infe-right'>     
            {/* Muestra de resultado de analisis */}
              <div className='cont-infe-right-sup'>
                <>
                  <h2>Ruta Optima del Nodo {nodoOrigen} al Nodo {nodoDestino}</h2>
                  <hr />
                  <h2>Camino Optimo: </h2>

                  {rutaCalculada && rutaCalculada.caminoFinal && rutaCalculada.caminoFinal.length > 0 ? (
                    <>
                      {rutaCalculada.caminoFinal.map((paso, index) => (
                        <h3 key={index}>
                          De {paso.anterior} a {paso.actual} (Costo: {paso.p})
                        </h3>
                      ))}
                    </>
                  ) : (
                    <h4>No existe ruta entre Nodo {nodoOrigen} y el Nodo {nodoDestino}</h4>
                  )
                  }
                  <hr />
                  <h2>Costo Total</h2>
                  {rutaCalculada && rutaCalculada.caminoFinal && rutaCalculada.caminoFinal.length > 0 ? (
                    <><h1>{rutaCalculada.costoTotal}</h1>
                      <hr />
                      <h2>Nodos recoridos</h2>
                      <h1>{rutaCalculada.caminoFinal.length}</h1>
                    </>
                  ) : (
                    <h4>No existe ruta entre Nodo {nodoOrigen} y el Nodo {nodoDestino}</h4>
                  )}
                </>
              </div>

              <div className='cont-infe-right-inf'>
                <h2>Exportar Ruta</h2>
                <h4>Genera un archivo <strong>.txt</strong> con la ruta optima</h4>
                <br />
                {/* Boton para crear archivo txt */}
                <div className='cont-infe-right-inf-button' >
                  <a
                    download={nombreArch}
                    target='_blank'
                    rel="noreferrer"
                    href={archivoBlob ? URL.createObjectURL(archivoBlob) : '#'}
                    style={{ textDecoration: "none", color: "inherit", pointerEvents: estBotonTxt ? 'auto' : 'none' }}
                  >
                    <button
                      className='button-generar'
                    >
                      Generar .txt
                    </button>
                  </a>
                </div>
              </div>

        </div>
      </div>
    </>
  )
}

export default App
