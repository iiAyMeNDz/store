// ===== البيانات =====
let products = [];
let debts = [];

// ===== التهيئة =====
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        loadData();
        setupScrollToTop();
    }
});

// ===== تحميل البيانات =====
function loadData() {
    // تحميل المنتجات
    try {
        const savedProducts = localStorage.getItem('products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        } else {
            // بيانات افتراضية للمنتجات
            products = [
                {
                    id: Date.now() - 3000000,
                    name: 'سماعات لاسلكية',
                    price: 199,
                    quantity: 15,
                    image: null,
                    date: new Date().toLocaleDateString('ar-EG')
                },
                {
                    id: Date.now() - 2000000,
                    name: 'ساعة ذكية',
                    price: 599,
                    quantity: 8,
                    image: null,
                    date: new Date().toLocaleDateString('ar-EG')
                },
                {
                    id: Date.now() - 1000000,
                    name: 'حذاء رياضي',
                    price: 299,
                    quantity: 3,
                    image: null,
                    date: new Date().toLocaleDateString('ar-EG')
                }
            ];
        }
    } catch (e) {
        products = [];
    }
    
    // تحميل الديون
    try {
        const savedDebts = localStorage.getItem('debts');
        if (savedDebts) {
            debts = JSON.parse(savedDebts);
        }
    } catch (e) {
        debts = [];
    }
    
    // تحديث الواجهة
    renderProducts();
    renderDebts();
}

// ===== حفظ البيانات =====
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveDebts() {
    localStorage.setItem('debts', JSON.stringify(debts));
}

// ===== وظائف المنتجات =====
function addProduct() {
    // الحصول على القيم
    const name = document.getElementById('productName').value.trim();
    const price = document.getElementById('productPrice').value;
    const quantity = document.getElementById('productQuantity').value;
    const fileInput = document.getElementById('productImage');
    
    // التحقق
    if (!name) {
        alert('❌ الرجاء إدخال اسم المنتج');
        return;
    }
    
    if (!price || price <= 0) {
        alert('❌ الرجاء إدخال سعر صحيح');
        return;
    }
    
    // معالجة الصورة إذا وجدت
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            createProduct(name, price, quantity, e.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        createProduct(name, price, quantity, null);
    }
    
    // تفريغ الحقول
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productQuantity').value = '1';
    document.getElementById('productImage').value = '';
}

function createProduct(name, price, quantity, image) {
    const product = {
        id: Date.now(),
        name: name,
        price: parseFloat(price),
        quantity: parseInt(quantity) || 1,
        image: image,
        date: new Date().toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    };
    
    products.unshift(product);
    saveProducts();
    renderProducts();
    
    // رسالة نجاح
    showNotification('✅ تم إضافة المنتج بنجاح');
}

function deleteProduct(id) {
    if (confirm('🗑️ هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
        showNotification('🗑️ تم حذف المنتج');
    }
}

function renderProducts() {
    const container = document.getElementById('productsList');
    const countSpan = document.getElementById('productsCount');
    
    if (!container) return;
    
    // تحديث العداد
    if (countSpan) {
        countSpan.textContent = `${products.length} منتج`;
    }
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-box-open"></i>
                <p>لا توجد منتجات حالياً</p>
                <small>أضف منتجك الأول الآن</small>
            </div>
        `;
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}">`
                    : `<div class="no-image"><i class="fas fa-box"></i></div>`
                }
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <div class="product-price">${product.price} ريال</div>
                <div class="product-meta">
                    <span><i class="fas fa-cubes"></i> الكمية: ${product.quantity}</span>
                    <span><i class="fas fa-tag"></i> #${product.id.toString().slice(-6)}</span>
                </div>
                <div class="product-actions">
                    <span class="product-date"><i class="fas fa-calendar"></i> ${product.date}</span>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== وظائف الديون =====
function addDebt() {
    const name = document.getElementById('debtName').value.trim();
    const amount = document.getElementById('debtAmount').value;
    const note = document.getElementById('debtNote').value.trim();
    
    if (!name) {
        alert('❌ الرجاء إدخال اسم الشخص');
        return;
    }
    
    if (!amount || amount <= 0) {
        alert('❌ الرجاء إدخال مبلغ صحيح');
        return;
    }
    
    const debt = {
        id: Date.now(),
        name: name,
        amount: parseFloat(amount),
        note: note || 'بدون ملاحظات',
        date: new Date().toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
    
    debts.unshift(debt);
    saveDebts();
    renderDebts();
    
    // تفريغ الحقول
    document.getElementById('debtName').value = '';
    document.getElementById('debtAmount').value = '';
    document.getElementById('debtNote').value = '';
    
    showNotification('✅ تم تسجيل الدين بنجاح');
}

function deleteDebt(id) {
    if (confirm('🗑️ هل أنت متأكد من حذف هذا الدين؟')) {
        debts = debts.filter(d => d.id !== id);
        saveDebts();
        renderDebts();
        showNotification('🗑️ تم حذف الدين');
    }
}

function renderDebts() {
    const container = document.getElementById('debtsList');
    const countSpan = document.getElementById('debtsCount');
    const totalSpan = document.getElementById('totalDebts');
    
    if (!container) return;
    
    // تحديث العداد
    if (countSpan) {
        countSpan.textContent = `${debts.length} دين`;
    }
    
    if (debts.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <i class="fas fa-hand-holding-heart"></i>
                <p>لا توجد ديون مسجلة</p>
                <small>أضف دين جديد</small>
            </div>
        `;
        if (totalSpan) totalSpan.textContent = '0 ريال';
        return;
    }
    
    container.innerHTML = debts.map(debt => `
        <div class="debt-item">
            <div class="debt-info">
                <span class="debt-name">
                    <i class="fas fa-user"></i>
                    ${debt.name}
                </span>
                <span class="debt-amount">${debt.amount} ريال</span>
                <span class="debt-note">
                    <i class="fas fa-comment"></i>
                    ${debt.note}
                </span>
                <span class="debt-date">
                    <i class="fas fa-clock"></i>
                    ${debt.date}
                </span>
            </div>
            <button class="delete-btn" onclick="deleteDebt(${debt.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // حساب الإجمالي
    const total = debts.reduce((sum, debt) => sum + debt.amount, 0);
    if (totalSpan) {
        totalSpan.textContent = total.toFixed(2) + ' ريال';
    }
}

// ===== وظائف مساعدة =====
function showNotification(message) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--bg-card);
        border: 1px solid var(--accent-primary);
        color: white;
        padding: 12px 25px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        z-index: 9999;
        animation: slideDown 0.3s ease;
        font-size: 14px;
        backdrop-filter: blur(10px);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // إخفاء الإشعار بعد 2 ثانية
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

// إضافة تأثيرات حركية
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;
document.head.appendChild(style);        alert('الرجاء إدخال اسم المنتج والسعر');
        return;
    }
    
    // معالجة الصورة
    let imageData = null;
    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            createProduct(name, price, quantity, imageData);
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        createProduct(name, price, quantity, null);
    }
    
    // تفريغ الحقول
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productQuantity').value = '1';
    document.getElementById('productImage').value = '';
}

function createProduct(name, price, quantity, image) {
    const product = {
        id: Date.now(),
        name: name,
        price: parseFloat(price),
        quantity: parseInt(quantity) || 1,
        image: image,
        date: new Date().toLocaleDateString('ar-EG')
    };
    
    products.unshift(product);
    saveProducts();
    renderProducts();
}

function deleteProduct(id) {
    if (confirm('هل أنت متأكد من الحذف؟')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
    }
}

function renderProducts() {
    const container = document.getElementById('productsList');
    if (!container) return;
    
    if (products.length === 0) {
        container.innerHTML = '<div class="empty-message">لا توجد منتجات</div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-image">
                ${product.image 
                    ? `<img src="${product.image}" alt="${product.name}">`
                    : `<i class="fas fa-box"></i>`
                }
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="product-price">${product.price} ريال</span>
                <span class="product-quantity">الكمية: ${product.quantity}</span>
                <small>${product.date || ''}</small>
            </div>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// ===== وظائف الديون =====
function addDebt() {
    const name = document.getElementById('debtName').value;
    const amount = document.getElementById('debtAmount').value;
    const note = document.getElementById('debtNote').value;
    
    if (!name || !amount) {
        alert('الرجاء إدخال اسم الشخص والمبلغ');
        return;
    }
    
    const debt = {
        id: Date.now(),
        name: name,
        amount: parseFloat(amount),
        note: note || 'بدون ملاحظات',
        date: new Date().toLocaleDateString('ar-EG')
    };
    
    debts.unshift(debt);
    saveDebts();
    renderDebts();
    
    // تفريغ الحقول
    document.getElementById('debtName').value = '';
    document.getElementById('debtAmount').value = '';
    document.getElementById('debtNote').value = '';
}

function deleteDebt(id) {
    if (confirm('هل تريد حذف هذا الدين؟')) {
        debts = debts.filter(d => d.id !== id);
        saveDebts();
        renderDebts();
    }
}

function renderDebts() {
    const container = document.getElementById('debtsList');
    if (!container) return;
    
    if (debts.length === 0) {
        container.innerHTML = '<div class="empty-message">لا توجد ديون</div>';
        document.getElementById('totalDebts').textContent = '0 ريال';
        return;
    }
    
    container.innerHTML = debts.map(debt => `
        <div class="debt-item">
            <div class="debt-info">
                <span class="debt-name">${debt.name}</span>
                <span class="debt-amount">${debt.amount} ريال</span>
                <span class="debt-note">${debt.note}</span>
                <span class="debt-date">${debt.date}</span>
            </div>
            <button class="delete-btn" onclick="deleteDebt(${debt.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // حساب الإجمالي
    const total = debts.reduce((sum, debt) => sum + debt.amount, 0);
    document.getElementById('totalDebts').textContent = total + ' ريال';
}

// زر العودة للأعلى
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}
