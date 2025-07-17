//Este archivo se encarga de crear los nodos
// //empleando la herramienta ReactFlow importanto @xyflow/react


import { ReactFlow, Background, Controls,applyEdgeChanges,MarkerType, applyNodeChanges } from '@xyflow/react';
import { useCallback,useEffect, useState } from 'react';
import CustomNode from './CustomNode.jsx';
import '@xyflow/react/dist/style.css';
import './Grafica.css';

const nodeTypes = {
  custom: CustomNode,
};



export default function Grafica({nodosLista=[],conexionesLista=[]}) {
  const [nodosfinal, setNodes] = useState([]);
  const [conexionesfinal, setEdges] = useState([]);
   useEffect(() => {
  const nodos=nodosLista.map((nodo) => ({
    id:nodo.id,
    type:'custom',
    data: {label:`Nodo ${nodo.id}`},
    position:nodo.position,
  }));

  const conexiones=conexionesLista.map((conex)=>(
    { 
      id:`e${conex.origen}-${conex.destino}`,
      source: conex.origen,
      target: conex.destino,
      label:`${conex.peso}`,
       markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: conex.escamino ? '#6cf341' :'#f5f5f5', // Logica para resaltar felcha
    },
    
    style: {
      strokeWidth: conex.escamino ? 4 : 3,
      stroke: conex.escamino ? '#6cf341' :'#f5f5f5',// Logica para resaltar arista
    },
    }
  ));
  setNodes(nodos)
  setEdges(conexiones)
    }, [nodosLista, conexionesLista]); 

  const onNodesChange = useCallback(
  (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
  [],
);
const onEdgesChange = useCallback(
  (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
  [],
);

  
  return (
    <div className="graph-container">

      <ReactFlow
      nodes={nodosfinal}
      edges={conexionesfinal}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      >
      <Background />
      <Controls />
    </ReactFlow>
    </div >
  );
}