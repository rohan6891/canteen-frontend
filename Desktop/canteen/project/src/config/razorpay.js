// Razorpay configuration
export const RAZORPAY_CONFIG = {
  key_id: 'rzp_test_NyLZPzYHIYtxqW',
  key_secret: 'OixhI108NMwzhJIAkNrHx5jx',
  currency: 'INR',
  name: 'Canteen Management System',
  description: 'Payment for food order',
  theme: {
    color: '#3B82F6'
  }
}

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}