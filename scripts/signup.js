 function handleSignUp(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            alert("Signed Up successfully!");
            window.location.href = 'login.html';
        }