import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { 
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, Calendar, Clock, AlertCircle } from 'lucide-react';

import { StudiPathTask } from '@/src/services/studipath';

const COLUMNS = [
  { id: 'todo', title: 'Belum Selesai' },
  { id: 'missed', title: 'Terlewat' },
  { id: 'done', title: 'Selesai' }
];

export function StudiPathBoard({ tasks, onTaskUpdate }: { tasks: StudiPathTask[], onTaskUpdate: (taskId: string, newStatus: string) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
       const taskId = String(active.id);
       const targetColId = String(over.id).replace('drop-', '');
       
       if (COLUMNS.map(c => c.id).includes(targetColId)) {
          onTaskUpdate(taskId, targetColId);
       } else {
          // It was dropped onto another item in a different column
          const overTask = tasks.find(t => t.id === over.id);
          if (overTask && overTask.status !== tasks.find(t => t.id === taskId)?.status) {
            onTaskUpdate(taskId, overTask.status);
          }
       }
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(col => (
          <BoardColumn 
            key={col.id} 
            id={col.id} 
            title={col.title} 
            tasks={tasks.filter(t => t.status === col.id || (col.id === 'todo' && t.status === 'upcoming'))} 
            onTaskUpdate={onTaskUpdate}
          />
        ))}
      </div>
    </DndContext>
  );
}

function BoardColumn({ id, title, tasks, onTaskUpdate }: { id: string, title: string, tasks: StudiPathTask[], onTaskUpdate: (id: string, s: string) => void }) {
   return (
     <div id={`drop-${id}`} className="bg-slate-50 dark:bg-slate-800/20 rounded-2xl p-4 min-h-[300px] border border-slate-100 dark:border-white/5 flex flex-col">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 px-2 tracking-tight flex items-center justify-between">
          {title}
          <span className="bg-white dark:bg-slate-800 text-xs px-2 py-1 rounded-lg text-slate-500 border border-slate-200 dark:border-white/5">{tasks.length}</span>
        </h4>
        <SortableContext 
          items={tasks.map(t => t.id)}
          strategy={rectSortingStrategy}
        >
          <div className="space-y-3 flex-1">
            {tasks.map(task => (
              <SortableTaskCard key={task.id} task={task} onTaskUpdate={onTaskUpdate} />
            ))}
            {tasks.length === 0 && (
               <div className="h-full flex items-center justify-center pt-8">
                 <p className="text-sm text-slate-400">Kosong</p>
               </div>
            )}
          </div>
        </SortableContext>
     </div>
   )
}

function SortableTaskCard({ task, onTaskUpdate }: { task: StudiPathTask, onTaskUpdate: (id: string, s: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: task.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`bg-white dark:bg-slate-900 p-4 rounded-xl border transition-all cursor-grab active:cursor-grabbing shadow-sm ${task.status === 'done' ? 'border-slate-100 dark:border-white/5 opacity-70' : 'border-slate-200 dark:border-white/10 hover:border-indigo-500/50 hover:shadow-md'}`}
    >
      <div className="flex justify-between items-start mb-2">
         <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${task.priority === 'high' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
            {task.subject}
         </span>
         <button 
           onClick={(e) => { e.stopPropagation(); onTaskUpdate(task.id, task.status === 'done' ? 'todo' : 'done'); }}
           className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors mt-0.5 ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-indigo-500'}`}
         >
           <Check className="w-3 h-3" />
         </button>
      </div>
      <h5 className={`text-sm font-semibold mb-1 leading-snug ${task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>{task.title}</h5>
      <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-3">
         <div className="flex items-center gap-1">
           <Clock className="w-3 h-3" />
           <span>{task.estimatedMinutes}m</span>
         </div>
         <div className="flex items-center gap-1">
           <Calendar className="w-3 h-3" />
           <span>Hari {task.dayNumber}</span>
         </div>
      </div>
    </div>
  );
}
