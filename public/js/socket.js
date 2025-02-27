// Script untuk menangani notifikasi real-time dengan Socket.IO

document.addEventListener('DOMContentLoaded', function() {
    // Dapatkan token JWT dari cookies
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
  
    const token = getCookie('token');
    if (!token) {
      console.error('Token not found. Socket connection failed.');
      return;
    }
  
    // Inisialisasi koneksi Socket.IO
    const socket = io({
      query: {
        token
      }
    });
  
    // Event ketika terhubung
    socket.on('connect', function() {
      console.log('Connected to Socket.IO server');
    });
  
    // Event ketika terputus
    socket.on('disconnect', function() {
      console.log('Disconnected from Socket.IO server');
    });
  
    // Event ketika ada error
    socket.on('connect_error', function(error) {
      console.error('Socket.IO connection error:', error);
    });
  
    // Event ketika menerima notifikasi tugas baru
    socket.on('newTask', function(data){
      showNotification(data.message);
      
      // Refresh daftar tugas
    });
}); // Tambahkan tanda kurung tutup di sini