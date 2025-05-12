document.addEventListener('DOMContentLoaded', function() {
    const authNav = document.getElementById('authNav');
    
    // Use UserSession to check login status
    if (window.UserSession && window.UserSession.isLoggedIn()) {
        const user = window.UserSession.getCurrentUser();
        // Show user profile and logout for logged-in users
        authNav.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="profile.html">
                    <i class="fas fa-user"></i> ${user.firstName}
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="UserSession.logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </li>
        `;
    } else {
        // Show login and signup for non-logged-in users
        authNav.innerHTML = `
            <li class="nav-item">
                <a class="nav-link" href="login.html">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="signup.html">
                    <i class="fas fa-user-plus"></i> Sign Up
                </a>
            </li>
        `;
    }
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
} 