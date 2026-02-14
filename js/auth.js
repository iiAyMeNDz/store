// بيانات المستخدمين (بسيطة وسريعة)
const users = {
    admin: { name: 'أحمد المدير', password: '123456' },
    mohamed: { name: 'محمد', password: '123456' },
    sara: { name: 'سارة', password: '123456' },
    user: { name: 'مستخدم', password: '123456' }
};

// تسجيل الدخول
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // التحقق من وجود المستخدم
            if (users[username] && users[username].password === password) {
                localStorage.setItem('currentUser', JSON.stringify({
                    username: username,
                    name: users[username].name
                }));
                window.location.href = 'dashboard.html';
            } else {
                alert('❌ اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        });
    }
    
    // عرض اسم المستخدم في لوحة التحكم
    if (window.location.pathname.includes('dashboard.html')) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            window.location.href = 'index.html';
        } else {
            document.getElementById('displayName').textContent = user.name;
        }
    }
});

// تسجيل الخروج
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('products');
    window.location.href = 'index.html';
}
