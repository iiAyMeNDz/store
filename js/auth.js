// حسابات المستخدمين
const users = {
    admin: { name: 'مدير المتجر', password: '123456' },
    user: { name: 'موظف', password: '123456' }
};

// تسجيل الدخول
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
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
    
    // عرض اسم المستخدم
    if (window.location.pathname.includes('dashboard.html')) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            window.location.href = 'index.html';
        } else {
            document.getElementById('userDisplayName').textContent = user.name;
        }
    }
});

// تسجيل الخروج
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
