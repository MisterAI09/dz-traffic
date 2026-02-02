// 1. إعدادات الاتصال بـ Supabase
// ملاحظة: تم وضع ANON_KEY مباشرة كما طلبت، لكن يفضل مستقبلاً حمايته
const SUPABASE_URL = "https://nbioqaxgjzpyrbcwdkds.supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5iaW9xYXhnanpweXJiY3d rZHMuc3VwYWJhc2UuY28iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczMjgxODk0NSwiZXhwIjoyMDQ4Mzk0OTQ1fQ.6L-9K_8XvX5H_x_x_x_x_x_x"; // استبدل هذا بالمفتاح الحقيقي من إعدادات Supabase

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. وظيفة تسجيل الدخول عبر جوجل (توضع في صفحة index.html)
async function loginWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/profile.html' // التوجه للبروفايل بعد النجاح
        }
    });
    if (error) console.error("خطأ في تسجيل الدخول:", error.message);
}

// 3. وظيفة حفظ بيانات البروفايل (توضع في صفحة profile.html)
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.onsubmit = async (e) => {
        e.preventDefault();
        
        // الحصول على المستخدم الحالي المسجل عبر Gmail
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert("يرجى تسجيل الدخول أولاً!");
            return;
        }

        const updates = {
            id: user.id,
            username: document.getElementById('username').value,
            full_name: document.getElementById('full_name').value,
            phone: document.getElementById('phone').value,
            updated_at: new Date()
        };

        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) {
            alert("حدث خطأ أثناء الحفظ: " + error.message);
        } else {
            alert("تم حفظ بياناتك بنجاح! استعد لجمع النقاط.");
            window.location.href = "dashboard.html"; // التوجه لصفحة المهام
        }
    };
}

// 4. وظيفة جلب النقاط وتحديث الواجهة (توضع في dashboard.html)
async function updatePointsDisplay() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('points')
            .eq('id', user.id)
            .single();
            
        const pointsElement = document.getElementById('userPoints');
        if (pointsElement) {
            pointsElement.innerText = profile?.points || 0;
        }
    }
}
