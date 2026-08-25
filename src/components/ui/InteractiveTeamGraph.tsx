'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// ============================================================
// InteractiveTeamGraph — SVG/Canvas network visualization
// Section 7.11 — used on Landing hero + Team Builder + graph view
// ============================================================

export interface GraphNode {
  id: string;
  label: string;
  sublabel?: string;
  type: 'project' | 'member' | 'open' | 'skill';
  matchScore?: number;
  color?: string;
  skills?: string[];
}

interface GraphEdge {
  from: string;
  to: string;
  strength?: number; // 0-1, affects line thickness/opacity
}

interface InteractiveTeamGraphProps {
  nodes: GraphNode[];
  edges?: GraphEdge[];
  width?: number;
  height?: number;
  mode?: 'marketing' | 'interactive';
  className?: string;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  hovered: boolean;
}

const NODE_COLORS: Record<string, string> = {
  project: '#7C3AED',
  member: '#2563EB',
  open: '#334155',
  skill: '#059669',
};

function scoreToColor(score?: number): string {
  if (!score) return '#3B82F6';
  if (score >= 90) return '#10B981';
  if (score >= 75) return '#06B6D4';
  return '#8B5CF6';
}

export function InteractiveTeamGraph({
  nodes,
  edges,
  width = 600,
  height = 400,
  mode = 'interactive',
  className = '',
}: InteractiveTeamGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);
  const posRef = useRef<NodePosition[]>([]);

  // Initialize node positions in a circular layout
  useEffect(() => {
    if (!nodes.length) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const projectNode = nodes.find(n => n.type === 'project');
    const otherNodes = nodes.filter(n => n.type !== 'project');
    const radius = Math.min(width, height) * 0.32;

    const newPositions: NodePosition[] = nodes.map((node, i) => {
      let x = centerX;
      let y = centerY;

      if (node.type !== 'project') {
        const idx = otherNodes.indexOf(node);
        const angle = (idx / Math.max(otherNodes.length, 1)) * 2 * Math.PI - Math.PI / 2;
        x = centerX + Math.cos(angle) * radius;
        y = centerY + Math.sin(angle) * radius;
      }

      return {
        id: node.id,
        x,
        y,
        vx: 0,
        vy: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        hovered: false,
      };
    });

    posRef.current = newPositions;
    setPositions(newPositions);
  }, [nodes, width, height]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nodes.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // HiDPI
    const dpr = window.devicePixelRatio ?? 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.008;

      const pos = posRef.current;
      if (!pos.length) { animRef.current = requestAnimationFrame(draw); return; }

      // Apply idle float
      const animated = pos.map(p => {
        const node = nodes.find(n => n.id === p.id);
        if (node?.type === 'project') return p; // center node stays still
        const floatX = Math.sin(t * p.speed + p.phase) * 4;
        const floatY = Math.cos(t * p.speed * 0.7 + p.phase + 1) * 4;
        return { ...p, x: p.x + floatX * 0.016, y: p.y + floatY * 0.016 };
      });
      // Note: we use a separate copy for drawing without mutating posRef
      // Actual float is additive to base positions - we track base separately
      const drawPos = pos.map(p => {
        const node = nodes.find(n => n.id === p.id);
        if (node?.type === 'project') return p;
        return {
          ...p,
          x: p.x + Math.sin(t * p.speed + p.phase) * 4,
          y: p.y + Math.cos(t * p.speed * 0.7 + p.phase + 1) * 4,
        };
      });

      const getPosById = (id: string) => drawPos.find(p => p.id === id);

      // Draw edges
      const edgeList = edges ?? nodes
        .filter(n => n.type !== 'project')
        .map(n => {
          const proj = nodes.find(nn => nn.type === 'project');
          return { from: proj?.id ?? '', to: n.id, strength: (n.matchScore ?? 80) / 100 };
        });

      for (const edge of edgeList) {
        const fromPos = getPosById(edge.from);
        const toPos = getPosById(edge.to);
        if (!fromPos || !toPos) continue;

        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        const isHighlighted = hoveredId === edge.from || hoveredId === edge.to;

        const strength = edge.strength ?? 0.8;
        const alpha = isHighlighted ? 0.9 : (hoveredId ? 0.2 : 0.5) * strength;
        const lineWidth = isHighlighted ? 2.5 : 1.5 * strength;

        // Draw curved line
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2 - 20;

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.quadraticCurveTo(midX, midY, toPos.x, toPos.y);

        const toColor = toNode?.matchScore ? scoreToColor(toNode.matchScore) : '#3B82F6';
        const gradient = ctx.createLinearGradient(fromPos.x, fromPos.y, toPos.x, toPos.y);
        gradient.addColorStop(0, `rgba(124,58,237,${alpha})`);
        gradient.addColorStop(1, `${toColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // Animated dot along the line
        const progress = (t * 0.5 + parseInt(edge.to.replace(/\D/g,'') || '0', 10) * 0.2) % 1;
        const dotX = fromPos.x + (toPos.x - fromPos.x) * progress;
        const dotY = fromPos.y + (toPos.y - fromPos.y) * progress;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${alpha * 0.8})`;
        ctx.fill();
      }

      // Draw nodes
      for (const p of drawPos) {
        const node = nodes.find(n => n.id === p.id);
        if (!node) continue;

        const isHovered = hoveredId === node.id;
        const isDimmed = hoveredId && !isHovered;

        const radius =
          node.type === 'project' ? 36 :
          node.type === 'open' ? 22 :
          28;

        const color = node.matchScore
          ? scoreToColor(node.matchScore)
          : NODE_COLORS[node.type] ?? '#3B82F6';

        ctx.globalAlpha = isDimmed ? 0.25 : 1;

        if (node.type === 'project') {
          // Project node pulse ring
          const ringRadius = radius + 8 + Math.sin(t * 2) * 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(124,58,237,0.3)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Node glow
        if (isHovered || node.type === 'project') {
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2);
          grd.addColorStop(0, `${color}30`);
          grd.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }

        // Node background
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHovered ? radius + 3 : radius, 0, Math.PI * 2);
        if (node.type === 'open') {
          ctx.setLineDash([4, 3]);
          ctx.strokeStyle = 'rgba(100,116,139,0.6)';
          ctx.lineWidth = 1.5;
          ctx.fillStyle = 'rgba(30,35,50,0.6)';
          ctx.fill();
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          ctx.fillStyle = `${color}25`;
          ctx.fill();
          ctx.strokeStyle = isHovered ? color : `${color}80`;
          ctx.lineWidth = isHovered ? 2 : 1.5;
          ctx.stroke();
        }

        // Node icon/letter
        ctx.fillStyle = node.type === 'open' ? '#475569' : color;
        ctx.font = `${node.type === 'project' ? 700 : 600} ${node.type === 'project' ? 13 : 11}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const initials = node.label
          .split(' ')
          .slice(0, node.type === 'project' ? 1 : 2)
          .map(w => w[0])
          .join('');
        ctx.fillText(node.type === 'project' ? '✦' : initials, p.x, p.y);

        // Label below node
        ctx.fillStyle = isDimmed ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.85)';
        ctx.font = `${isHovered ? 600 : 500} 10px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(
          node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label,
          p.x,
          p.y + radius + 5
        );

        if (node.sublabel) {
          ctx.fillStyle = 'rgba(148,163,184,0.7)';
          ctx.font = '9px Inter, sans-serif';
          ctx.fillText(node.sublabel, p.x, p.y + radius + 17);
        }

        ctx.globalAlpha = 1;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [nodes, edges, width, height, hoveredId]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (mode === 'marketing') return;
      const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const pos = posRef.current;
      let found: string | null = null;
      let foundNode: GraphNode | null = null;

      for (const p of pos) {
        const node = nodes.find(n => n.id === p.id);
        const r = node?.type === 'project' ? 36 : 28;
        const dist = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
        if (dist < r + 8) {
          found = p.id;
          foundNode = node ?? null;
          break;
        }
      }

      setHoveredId(found);
      if (found && foundNode) {
        setTooltip({ x: mx, y: my, node: foundNode });
      } else {
        setTooltip(null);
      }
    },
    [mode, nodes]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    setTooltip(null);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: hoveredId ? 'pointer' : 'default',
          display: 'block',
        }}
      />

      {/* Tooltip */}
      {tooltip && mode === 'interactive' && (
        <div
          className="glass-floating"
          style={{
            position: 'absolute',
            left: tooltip.x + 14,
            top: tooltip.y - 14,
            padding: '10px 14px',
            borderRadius: 12,
            pointerEvents: 'none',
            zIndex: 100,
            maxWidth: 200,
            animation: 'fadeInScale 150ms ease',
          }}
        >
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#E2E8F0', marginBottom: 4 }}>
            {tooltip.node.label}
          </div>
          {tooltip.node.sublabel && (
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: 4 }}>
              {tooltip.node.sublabel}
            </div>
          )}
          {tooltip.node.matchScore && (
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: scoreToColor(tooltip.node.matchScore),
              }}
            >
              {tooltip.node.matchScore}% match
            </div>
          )}
          {tooltip.node.skills?.length && (
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {tooltip.node.skills.slice(0, 3).map(s => (
                <span
                  key={s}
                  style={{
                    fontSize: '0.65rem',
                    padding: '1px 6px',
                    borderRadius: 9999,
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.3)',
                    color: '#C4B5FD',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
