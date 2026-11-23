/**
 * Firebase 配置 — 所有頁面共用
 * ⚠️ 若需切換為自己的專案，請替換下方的 Firebase 專案設定
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore, collection, doc,
    addDoc, getDocs, getDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAHl-43WWge7-kurG49h9OaruAGRHfSxxs",
    authDomain: "disc-2025.firebaseapp.com",
    projectId: "disc-2025",
    storageBucket: "disc-2025.firebasestorage.app",
    messagingSenderId: "537425552995",
    appId: "1:537425552995:web:dc91306c6b4d6595dafa56"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * 獲取 URL 中的公司代碼（相容 ?company=、?c= 與舊版 ?ref=）
 */
function getCompanyCode() {
    const params = new URLSearchParams(window.location.search);
    return (params.get('company') || params.get('c') || params.get('ref') || '').trim();
}

/**
 * 向下相容舊介面名稱
 */
function getRefCode() {
    return getCompanyCode();
}

/**
 * HTML 跳脫，避免 XSS
 */
function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * 查詢公司戶是否具備進階分析權限（需管理員於後台設定 allow_advanced: true）
 */
async function checkCompanyAdvancedPermission(userOrCode) {
    if (!userOrCode) return false;
    if (typeof userOrCode === 'object') {
        if (userOrCode.role === 'admin') return true;
        if (userOrCode.id) {
            try {
                const snap = await getDoc(doc(db, 'users', userOrCode.id));
                if (snap.exists()) return Boolean(snap.data().allow_advanced);
            } catch (e) {
                console.warn('權限查詢失敗', e);
            }
        }
        return Boolean(userOrCode.allow_advanced);
    }
    const code = String(userOrCode).trim();
    if (!code) return false;
    try {
        const snap1 = await getDocs(query(collection(db, 'users'), where('company_code', '==', code)));
        const hit1 = snap1.docs.map(d => d.data()).find(u => u.role === 'company' || u.role === 'influencer');
        if (hit1) return Boolean(hit1.allow_advanced);
        const snap2 = await getDocs(query(collection(db, 'users'), where('referral_code', '==', code)));
        const hit2 = snap2.docs.map(d => d.data()).find(u => u.role === 'company' || u.role === 'influencer');
        if (hit2) return Boolean(hit2.allow_advanced);
    } catch (e) {
        console.warn('公司權限查詢失敗', e);
    }
    return false;
}

export {
    db, collection, doc,
    addDoc, getDocs, getDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, Timestamp,
    getCompanyCode, getRefCode, escapeHtml,
    checkCompanyAdvancedPermission
};
