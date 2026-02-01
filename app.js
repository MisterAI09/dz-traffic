// بيانات مشروعك من الصورة رقم 3
const SUPABASE_URL = "https://nbioqaxgjzpyrbcwdkds.supabase.co"; 
const SUPABASE_KEY = "ضعه_هنا_من_إعدادات_API_Keys"; 

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('profileForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const user = supabase.auth.user(); // الحصول على المستخدم الحالي
    const updates = {
        id: user.id,
        username: document.getElementById('username').value,
        full_name: document.getElementById('full_name').value,
        phone: document.getElementById('phone').value,
        updated_at: new Date()
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) alert("حدث خطأ: " + error.message);
    else {
        alert("تم حفظ بياناتك بنجاح! استعد لجمع النقاط.");
        window.location.href = "dashboard.html"; // التوجه لصفحة المهام
    }
};
