// البيانات
let products = [];
let debts = [];

// التهيئة
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        loadData();
        setupScrollToTop();
    }
});

// تحميل البيانات
function loadData() {
    // تحميل المنتجات
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // بيانات افتراضية
        products = [
            {
                id: Date.now() - 3000,
                name: 'سماعات',
                price: 150,
                quantity: 10,
                image: null
            },
            {
                id: Date.now() - 2000,
                name: 'ساعة',
                price: 300,
                quantity: 5,
                image: null
            }
        ];
    }
    
    // تحميل الديون
    const savedDebts = localStorage.getItem('debts');
    if (savedDebts) {
        debts = JSON.parse(savedDebts);
    }
    
    renderProducts();
    renderDebts();
}

// حفظ البيانات
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveDebts() {
    localStorage.setItem('debts', JSON.stringify(debts));
}

// ===== وظائف المنتجات =====
function addProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const quantity = document.getElementById('productQuantity').value;
    const fileInput = document.getElementById('productImage');
    
    if (!name || !price) {
        alert('الرجاء إدخال اسم المنتج والسعر');
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
