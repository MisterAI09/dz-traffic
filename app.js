// 1. إعدادات الاتصال بمشروعك (نستخدم المفاتيح التي تظهر في إعدادات API بموقع Supabase)
const SUPABASE_URL = "https://nbioqaxgjzpyrbcwdkds.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaW9xYXhnanpweXJiY3dkZHMuY28iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMjgxODk0NSwiZXhwIjoyMDQ4Mzk0OTQ1fQ.6L-9K_8XvX5H_x_x_x_x_x_x"; // هذا هو مفتاح الـ ANON الخاص بك

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. وظيفة تسجيل الدخول عبر Google (كما فعلت في الصورة)
async function loginWithGoogle() {
    const { error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/profile.html' 
        }
    });
    if (error) alert("خطأ في الاتصال بجوجل: " + error.message);
}

// 3. وظيفة حفظ بيانات البروفايل (عند التسجيل لأول مرة)
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.onsubmit = async (e) => {
        e.preventDefault();
        
        const { data: { user } } = await _supabase.auth.getUser();

        if (!user) {
            alert("يرجى الدخول عبر Gmail أولاً");
            return;
        }

        const updates = {
            id: user.id,
            username: document.getElementById('username').value,
            full_name: document.getElementById('full_name').value,
            phone: document.getElementById('phone').value,
            updated_at: new Date(),
            points: 0 // يبدأ المستخدم بـ 0 نقطة
        };

        const { error } = await _supabase.from('profiles').upsert(updates);

        if (error) {
            alert("حدث خطأ أثناء الحفظ: " + error.message);
        } else {
            alert("تم إعداد حسابك بنجاح! 🚀");
            window.location.href = "dashboard.html"; 
        }
    };
}

// 4. وظيفة جلب النقاط الحالية في لوحة التحكم
async function loadUserPoints() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (user) {
        const { data: profile } = await _supabase
            .from('profiles')
            .select('points')
            .eq('id', user.id)
            .single();
            
        const pointsDisplay = document.getElementById('userPoints');
        if (pointsDisplay) pointsDisplay.innerText = profile?.points || 0;
    }
}

// تشغيل جلب النقاط إذا كنا في صفحة Dashboard
if (window.location.pathname.includes('dashboard.html')) {
    loadUserPoints();
}
