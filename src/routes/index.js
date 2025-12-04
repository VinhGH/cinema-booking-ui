// Routing configuration can be centralized here if needed
// For now, routes are defined in App.jsx
export const routes = [
    { path: '/', component: 'Home' },
    { path: '/movie/:id', component: 'MovieDetail' },
    { path: '/booking/:id', component: 'Booking' },
    { path: '/payment', component: 'Payment' },
    { path: '/tickets', component: 'MyTickets' },
    { path: '/login', component: 'Login' },
    { path: '/register', component: 'Register' },
    { path: '/admin', component: 'Admin' },
]
