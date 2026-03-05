/**
 * Supabase 配置 — 所有页面共用
 */
const SUPABASE_URL = 'https://qipmybtejdqnufemclmh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_73YQCMPYyUmDULj2CdDQIQ_zZX76Y-H';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * 获取 URL 中的 ?ref=CODE 推荐码
 */
function getRefCode() {
    return new URLSearchParams(window.location.search).get('ref') || '';
}
