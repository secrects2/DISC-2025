/**
 * Firebase 配置 — 所有頁面共用
 * ⚠️ 請將下方的佔位符替換為你自己的 Firebase 專案設定
 *    (Firebase Console → 專案設定 → 一般 → 你的應用程式 → Firebase SDK snippet)
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore, collection, doc,
    addDoc, getDocs, getDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ========== ⚠️ 請填入你的 Firebase 設定 ==========
const firebaseConfig = {
    apiKey: "AIzaSyAHl-43WWge7-kurG49h9OaruAGRHfSxxs",
    authDomain: "disc-2025.firebaseapp.com",
    projectId: "disc-2025",
    storageBucket: "disc-2025.firebasestorage.app",
    messagingSenderId: "537425552995",
    appId: "1:537425552995:web:dc91306c6b4d6595dafa56"
};
// =================================================

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * 獲取 URL 中的 ?ref=CODE 推薦碼
 */
function getRefCode() {
    return new URLSearchParams(window.location.search).get('ref') || '';
}

export {
    db, collection, doc,
    addDoc, getDocs, getDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, Timestamp,
    getRefCode
};
