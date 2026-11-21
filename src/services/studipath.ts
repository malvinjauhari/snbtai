import { db } from "./firebase";
import { collection, doc, setDoc, getDocs, query, where, updateDoc, serverTimestamp, writeBatch } from "firebase/firestore";

export interface StudiPath {
  id: string;
  userId: string;
  title: string;
  targetExam: string;
  preparationDuration: string;
  dailyStudyTime: string;
  weakSubjects: string[];
  strongSubjects: string[];
  aiDiagnosis: string;
  strategySummary: string;
  studyRatio: Record<string, number>;
  weeklyRoadmap: {
    weekNumber: number;
    title: string;
    focus: string[];
    goal: string;
  }[];
  dashboardSummary: {
    todayFocus: string;
    estimatedMinutes: number;
    message: string;
  };
  createdAt: any;
  updatedAt: any;
}

export interface StudiPathTask {
  id: string;
  studyPathId: string;
  userId: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  taskType: string;
  estimatedMinutes: number;
  date: string; // ISO date string without time
  weekNumber: number;
  dayNumber: number;
  status: "todo" | "upcoming" | "missed" | "done" | "rescheduled";
  priority: "high" | "medium" | "low";
  createdAt: any;
  updatedAt: any;
  completedAt?: any;
}

export async function getActiveStudiPath(userId: string): Promise<StudiPath | null> {
  const q = query(
    collection(db, "studyPaths"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  
  const paths = snap.docs.map(d => ({ id: d.id, ...d.data() } as StudiPath));
  paths.sort((a, b) => {
    const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return bTime - aTime;
  });
  
  return paths[0];
}

export async function getStudiPathTasks(studyPathId: string, userId: string): Promise<StudiPathTask[]> {
  const q = query(
    collection(db, "studyPathTasks"),
    where("studyPathId", "==", studyPathId),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as StudiPathTask)).sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
}

export async function saveStudiPathAndTasks(userId: string, pathData: Omit<StudiPath, "id" | "userId" | "createdAt" | "updatedAt">, tasksData: Omit<StudiPathTask, "id" | "studyPathId" | "userId" | "createdAt" | "updatedAt">[]) {
  const pathRef = doc(collection(db, "studyPaths"));
  const studyPathId = pathRef.id;

  const sanitize = (obj: any) => JSON.parse(JSON.stringify(obj, (k, v) => v === undefined ? null : v));
  const cleanPathData = sanitize(pathData);
  const cleanTasksData = sanitize(tasksData);

  const newPath = {
    id: studyPathId,
    userId,
    ...cleanPathData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const batch = writeBatch(db);
  batch.set(pathRef, newPath);

  cleanTasksData.forEach((task: any) => {
    const taskRef = doc(collection(db, "studyPathTasks"));
    const newTask = {
      id: taskRef.id,
      studyPathId,
      userId,
      ...task,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    batch.set(taskRef, newTask);
  });

  await batch.commit();
  return studyPathId;
}

export async function updateTaskStatus(taskId: string, status: StudiPathTask["status"]) {
  const ref = doc(db, "studyPathTasks", taskId);
  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
    ...(status === "done" ? { completedAt: serverTimestamp() } : {})
  });
}

export async function rescheduleTask(taskId: string, newDate: string, newWeekNumber: number) {
  const ref = doc(db, "studyPathTasks", taskId);
  await updateDoc(ref, {
    date: newDate,
    weekNumber: newWeekNumber,
    status: "todo",
    updatedAt: serverTimestamp(),
  });
}
