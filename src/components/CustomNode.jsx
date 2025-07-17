//Esta es una funcion generica para dar personalizar el estilo del grafo usando la libreria XYflow
import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data }) {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Left} />
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}