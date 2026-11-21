import { callBackendAI } from "./ai";

export async function gatherStudiPathContext(userMessage: string, history: any[]) {
  const prompt = `
    Anda adalah AI Perancang Belajar (StudiPath) untuk persiapan UTBK SNBT.
    Tugas Anda adalah memahami kondisi belajar pengguna dan memastikan Anda memiliki cukup informasi untuk membuat jadwal belajar harian (StudiPath).

    KONTEKS YANG DIBUTUHKAN:
    1. Target Ujian (Misal: SNBT, Mandiri)
    2. Durasi Persiapan (Misal: 1 bulan, 3 minggu)
    3. Waktu Belajar Harian (Misal: 1 jam per hari, 30 menit)
    4. Mata Pelajaran/Subtes Lemah
    5. Mata Pelajaran/Subtes Kuat

    TUGAS:
    Analisis pesan pengguna terbaru beserta riwayat obrolan.
    Jika ada informasi WAJIB yang belum jelas, tanyakan kembali (maksimal 3 pertanyaan singkat & ramah).
    Jika informasi SUDAH CUKUP, beritahu bahwa Anda sudah paham dan siap membuat StudiPath.

    OUTPUT HARUS berupa JSON valid:
    {
      "isContextComplete": boolean,
      "aiResponse": "Pesan balasan ke user. Entah itu pertanyaan klarifikasi, atau pernyataan siap generate",
      "extractedContext": {
        "targetExam": "SNBT" atau lainnya,
        "preparationDuration": "...",
        "dailyStudyTime": "...",
        "weakSubjects": ["..."],
        "strongSubjects": ["..."]
      } // isi apa adanya yang sudah diketahui, null jika belum tahu
    }

    Jangan output hal lain selain JSON.
  `;

  const contents = [...history, { role: "user", parts: [{ text: userMessage }] }];

  try {
    const textData = await callBackendAI("STUDY_HELP", contents, { systemInstruction: prompt });
    let text = textData || '{}';
    if (text.includes('\`\`\`json')) text = text.split('\`\`\`json')[1].split('\`\`\`')[0];
    else if (text.includes('\`\`\`')) text = text.split('\`\`\`')[1].split('\`\`\`')[0];
    
    return JSON.parse(text.trim());
  } catch (err) {
    console.error("Error gathering StudiPath context", err);
    throw err;
  }
}

export async function generateStudiPathPlan(context: any) {
  const prompt = `
    Anda adalah AI Perancang Program Belajar (StudiPath) untuk persiapan UTBK SNBT.
    Buat roadmap belajar dan daftar task harian yang SANGAT REALISTIS berdasarkan kondisi pengguna berikut:
    Target: ${context.targetExam}
    Durasi Persiapan: ${context.preparationDuration}
    Waktu Belajar Harian: ${context.dailyStudyTime}
    Subtes Lemah: ${context.weakSubjects?.join(', ')}
    Subtes Kuat: ${context.strongSubjects?.join(', ')}

    ATURAN PEMBUATAN TASK:
    - Jika waktu harian <= 30 menit, jangan buat terlalu banyak task! Cukup 1-2 task ringan (misal: "Review konsep x", "10 soal PK").
    - Fokuskan pada subtes lemah, sesekali maintenance subtes kuat.
    - Jangan terlalu padat hingga tidak masuk akal. 
    - Buat rencana mingguan (weeklyRoadmap) untuk seluruh durasi persiapan (misal jika 1 bulan = 4 minggu).
    - Buat daftar "dailyTasks" UNTUK 14 HARI PERTAMA SAJA agar tidak kelebihan kuota teks. Setiap task berikan tanggal mulai hari ke-1, ke-2 dst.

    OUTPUT HARUS berupa JSON valid dengan skema berikut:
    {
      "title": "Judul StudiPath Singkat",
      "aiDiagnosis": "Diagnosis singkat & memotivasi tentang kondisi user",
      "strategySummary": "Strategi ringkas 1-2 kalimat",
      "studyRatio": { "Nama Subtes": persentase_angka },
      "weeklyRoadmap": [
        { "weekNumber": 1, "title": "...", "focus": ["..."], "goal": "..." }
      ],
      "dailyTasks": [
        {
          "dayNumber": 1,
          "weekNumber": 1,
          "title": "Contoh: Latihan 10 soal PK",
          "description": "Deskripsi task singkat",
          "subject": "PK",
          "topic": "Aljabar",
          "taskType": "practice", // concept, practice, review, mini_tryout
          "estimatedMinutes": 15,
          "priority": "high", // high, medium, low
          "status": "todo"
        }
      ],
      "dashboardSummary": {
        "todayFocus": "Fokus hari 1",
        "estimatedMinutes": 30,
        "message": "Pesan semangat"
      }
    }
  `;

  try {
    // We use GENERATE_STUDIPATH which costs 5 credits
    const textData = await callBackendAI("GENERATE_STUDIPATH", prompt, { responseMimeType: "application/json" });
    let text = textData || '{}';
    if (text.includes('\`\`\`json')) text = text.split('\`\`\`json')[1].split('\`\`\`')[0];
    else if (text.includes('\`\`\`')) text = text.split('\`\`\`')[1].split('\`\`\`')[0];
    
    return JSON.parse(text.trim());
  } catch (err) {
    console.error("Error generating StudiPath", err);
    throw err;
  }
}
