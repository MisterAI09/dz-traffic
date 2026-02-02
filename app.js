// 1. تهيئة الاتصال بـ Supabase باستخدام بيانات مشروعك
const SUPABASE_URL = "https://nbioqaxgjzpyrbcwdkds.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaW9xYXhnanpweXJiY3dkZHMuY28iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMjgxODk0NSwiZXhwIjoyMDQ4Mzk0OTQ1fQ.6L-9K_8XvX5H_x_x_x_x_x_x"; 

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. دالة تسجيل الدخول عبر Google (التي فعلتها في الصور)
async function loginWithGoogle() {
    const { error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // سيعود المستخدم إلى صفحة البروفايل بعد النجاح
            redirectTo: window.location.origin + '/profile.html' 
        }
    });
    if (error) alert("خطأ في تسجيل الدخول: " + error.message);
}

// 3. دالة حفظ بيانات البروفايل (تستخدم في profile.html)
async function saveProfile(event) {
    event.preventDefault();
    
    // جلب بيانات المستخدم المسجل حالياً
    const { data: { user } } = await _supabase.auth.getUser();

    if (!user) {
        alert("يرجى تسجيل الدخول عبر جوجل أولاً!");
        return;
    }

    const updates = {
        id: user.id,
        username: document.getElementById('username').value,
        full_name: document.getElementById('full_name').value,
        phone: document.getElementById('phone').value,
        updated_at: new Date(),
        points: 0 // رصيد البداية للمستخدم الجديد
    };

    const { error } = await _supabase.from('profiles').upsert(updates);

    if (error) {
        alert("حدث خطأ أثناء الحفظ: " + error.message);
    } else {
        alert("تم حفظ بياناتك بنجاح! 🚀");
        window.location.href = "dashboard.html";
    }
}

// ربط النموذج بالدالة إذا كان موجوداً في الصفحة
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', saveProfile);
}
