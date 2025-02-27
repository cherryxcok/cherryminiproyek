// Script untuk menangani login dan register

// Menangani form register
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Dapatkan nilai dari form
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validasi password
    if (password !== confirmPassword) {
      showMessage("Password dan konfirmasi password tidak cocok", "danger");
      return;
    }

    // Kirim data ke server
    fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showMessage(data.message, "success");
          // Redirect ke halaman login setelah 2 detik
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 2000);
        } else {
          showMessage(data.message || "Terjadi kesalahan. Silakan coba lagi.", "danger");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage("Terjadi kesalahan. Silakan coba lagi.", "danger");
      });
  });
}

// Menangani form login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Dapatkan nilai dari form
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Kirim data ke server
    fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Redirect ke dashboard setelah login berhasil
          window.location.href = "/tasks/dashboard";
        } else {
          showMessage(data.message || "Email atau password salah.", "danger");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showMessage("Terjadi kesalahan. Silakan coba lagi.", "danger");
      });
  });
}

// Fungsi untuk menampilkan pesan
function showMessage(message, type) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.className = `alert alert-${type}`;
  messageElement.style.display = "block";

  // Hilangkan pesan setelah 5 detik
  setTimeout(() => {
    messageElement.style.display = "none";
  }, 5000);
}
