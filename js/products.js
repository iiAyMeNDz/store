// مصفوفة المنتجات
let products = [];

// صور افتراضية للمنتجات
const defaultImages = [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
    'https://images.unsplash.com/photo-1503602642458-232111445657?w=300',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300',
];

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        loadProducts();
        setupScrollToTop();
        
        // نموذج إضافة منتج
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('productName').value;
                const price = parseFloat(document.getElementById('productPrice').value);
                const quantity = parseInt(document.getElementById('productQuantity').value);
                let image = document.getElementById('productImage').value;
                
                // إذا ما حط صورة، اختار صورة عشوائية
                if (!image) {
                    image = defaultImages[Math.floor(Math.random() * defaultImages.length)];
                }
                
                addProduct(name, price, quantity, image);
                
                // تفريغ النموذج
                productForm.reset();
                document.getElementById('productQuantity').value = '1';
            });
        }
    }
});

// تحميل المنتجات
function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // منتجات تجريبية
        products = [
            {
                id: Date.now() - 1000,
                name: 'سماعات لاسلكية',
                price: 199,
                quantity: 15,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'
            },
            {
                id: Date.now() - 2000,
                name: 'ساعة ذكية',
                price: 599,
                quantity: 8,
                image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300'
            },
            {
                id: Date.now() - 3000,
                name: 'حذاء رياضي',
                price: 299,
                quantity: 3,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300'
            }
        ];
        saveProducts();
    }
    renderProducts();
    updateStats();
}

// حفظ المنتجات
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// إضافة منتج
function addProduct(name, price, quantity, image) {
    const product = {
        id: Date.now(),
        name: name,
        price: price,
        quantity: quantity,
        image: image || defaultImages[Math.floor(Math.random() * defaultImages.length)]
    };
    
    products.unshift(product); // يضيف في البداية
    saveProducts();
    renderProducts();
    updateStats();
    
    // تأثير نجاح
    showNotification('✅ تم إضافة المنتج بنجاح');
}

// حذف منتج
function deleteProduct(id) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
        updateStats();
        showNotification('🗑️ تم حذف المنتج');
    }
}

// عرض المنتجات
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="glass" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-box-open" style="font-size: 48px; color: var(--accent-primary); opacity: 0.5;"></i>
                <p style="margin-top: 20px; color: var(--text-secondary);">لا توجد منتجات حالياً</p>
                <p style="color: var(--text-secondary);">أضف منتجك الأول الآن!</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // تحديد حالة المخزون
        let stockClass = '';
        let stockText = '';
        if (product.quantity <= 0) {
            stockClass = 'empty';
            stockText = 'غير متوفر';
        } else if (product.quantity <= 5) {
            stockClass = 'low';
            stockText = 'كمية محدودة';
        } else {
            stockClass = 'good';
            stockText = 'متوفر';
        }
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${product.price}</div>
                <div class="product-stock">
                    <span class="stock-indicator ${stockClass}"></span>
                    <span>المتوفر: ${product.quantity} قطعة</span>
                    <span style="margin-right: auto;">${stockText}</span>
                </div>
                <div class="product-actions">
                    <button class="delete-product" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// تحديث الإحصائيات
function updateStats() {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStock = products.filter(p => p.quantity <= 5).length;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = totalValue.toFixed(2);
    document.getElementById('lowStock').textContent = lowStock;
}

// إشعارات
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--glass-bg);
        backdrop-filter: blur(10px);
        border: 1px solid var(--accent-primary);
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 0 30px var(--accent-glow);
        z-index: 9999;
        animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
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
