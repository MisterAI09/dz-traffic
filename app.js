// بيانات مشروعك من إعدادات Supabase
const SUPABASE_URL = "https://nbioqaxgjzpyrbcwdkds.supabase.co"; 
const SUPABASE_KEY = "ضعه_هنا_من_إعدادات_API_Keys"; // مفتاح anon public

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// دالة حفظ بيانات البروفايل
document.getElementById('profileForm').onsubmit = async (e) => {
    e.preventDefault();
    
    // تصحيح: الحصول على المستخدم بطريقة حديثة
    const { data: { user } } = await supabase.auth.getUser(); 
    
    if (!user) return alert("يجب تسجيل الدخول أولاً!");

    const updates = {
        id: user.id, // استخدام المعرف الفريد للمستخدم
        username: document.getElementById('username').value,
        full_name: document.getElementById('full_name').value,
        phone: document.getElementById('phone').value,
        updated_at: new Date()
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) alert("حدث خطأ: " + error.message);
    else {
        alert("تم حفظ بياناتك بنجاح!");
        window.location.href = "dashboard.html";
    }
};
