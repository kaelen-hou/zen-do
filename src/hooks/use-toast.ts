'use client';

// 简单的 toast 实现，为了演示
// 在实际项目中，建议使用 sonner 或 react-hot-toast 等专业库

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function toast(options: ToastOptions) {
  // 创建 toast 元素
  const toastEl = document.createElement('div');
  toastEl.className = `
    fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm
    ${
      options.variant === 'destructive'
        ? 'bg-red-500 text-white'
        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
    }
  `;

  toastEl.innerHTML = `
    <div class="font-medium">${options.title}</div>
    ${options.description ? `<div class="text-sm opacity-80 mt-1">${options.description}</div>` : ''}
  `;

  document.body.appendChild(toastEl);

  // 动画显示
  requestAnimationFrame(() => {
    toastEl.style.transform = 'translateX(0)';
    toastEl.style.opacity = '1';
  });

  // 3秒后移除
  setTimeout(() => {
    toastEl.style.transform = 'translateX(100%)';
    toastEl.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toastEl);
    }, 300);
  }, 3000);
}
