// Import the functions you need from the SDKs you need
import type { Course, CourseSuggestion } from "@/types/course";
import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});

const db = getFirestore(app);

const necessaryVariablesExists =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID;

export const fetchCourses = async () => {
  if (!necessaryVariablesExists) return [];

  const snapshot = await getDocs(collection(db, "cursosUfc"));
  const data = snapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
      }) as Course,
  );
  return data;
};

export const suggestCourse = async (course: CourseSuggestion) => {
  if (!necessaryVariablesExists) return;

  const res = await addDoc(collection(db, "sugestoesCursos"), {
    name: course.name,
    courseMean: course.mean,
    courseStd: course.std,
    createdAt: serverTimestamp(),
  });
  return res.id;
};
