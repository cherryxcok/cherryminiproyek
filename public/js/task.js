// Script untuk menangani manajemen tugas

document.addEventListener("DOMContentLoaded", function () {
    // Filter tugas berdasarkan kategori (AJAX)
    const categoryLinks = document.querySelectorAll("#categoryFilter a");
    categoryLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
  
        // Hapus kelas active dari semua link
        categoryLinks.forEach((el) => el.classList.remove("active"));
  
        // Tambahkan kelas active ke link yang diklik
        this.classList.add("active");
  
        // Dapatkan kategori yang dipilih
        const category = this.getAttribute("data-category");
  
        // Ambil tugas berdasarkan kategori
        fetchTasks(category);
      });
    });
  
    // Tambah tugas baru
    const saveTaskBtn = document.getElementById("saveTaskBtn");
    if (saveTaskBtn) {
      saveTaskBtn.addEventListener("click", function () {
        const form = document.getElementById("addTaskForm");
  
        // Dapatkan nilai dari form
        const title = document.getElementById("title").value;
        const category = document.getElementById("category").value;
        const deadline = document.getElementById("deadline").value;
        const status = document.getElementById("status").value;
  
        // Validasi input
        if (!title || !category || !deadline || !status) {
          alert("Semua field harus diisi!");
          return;
        }
  
        // Kirim data ke server
        fetch("/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            category,
            deadline,
            status,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Tutup modal
              const modal = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
              modal.hide();
  
              // Reset form
              form.reset();
  
              // Refresh daftar tugas
              const activeCategory = document.querySelector("#categoryFilter a.active").getAttribute("data-category");
              fetchTasks(activeCategory);
            } else {
              alert(data.message || "Terjadi kesalahan saat menambahkan tugas.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
          });
      });
    }
  
    // Edit tugas
    const taskList = document.getElementById("taskList");
    if (taskList) {
      taskList.addEventListener("click", function (e) {
        // Jika tombol edit diklik
        if (e.target.closest(".edit-task")) {
          const button = e.target.closest(".edit-task");
          const taskId = button.getAttribute("data-id");
  
          // Dapatkan data tugas dari server
          fetch(`/tasks/${taskId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                const task = data.data;
  
                // Isi form edit dengan data tugas
                document.getElementById("editTaskId").value = task._id;
                document.getElementById("editTitle").value = task.title;
                document.getElementById("editCategory").value = task.category;
  
                // Format tanggal untuk input date
                const deadline = new Date(task.deadline);
                const formattedDeadline = deadline.toISOString().split("T")[0];
                document.getElementById("editDeadline").value = formattedDeadline;
  
                document.getElementById("editStatus").value = task.status;
              } else {
                alert(data.message || "Terjadi kesalahan saat mengambil data tugas.");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert("Terjadi kesalahan. Silakan coba lagi.");
            });
        }
  
        // Jika tombol hapus diklik
        if (e.target.closest(".delete-task")) {
          if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
            const button = e.target.closest(".delete-task");
            const taskId = button.getAttribute("data-id");
  
            // Hapus tugas
            fetch(`/tasks/${taskId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  // Refresh daftar tugas
                  const activeCategory = document.querySelector("#categoryFilter a.active").getAttribute("data-category");
                  fetchTasks(activeCategory);
                } else {
                  alert(data.message || "Terjadi kesalahan saat menghapus tugas.");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
                alert("Terjadi kesalahan. Silakan coba lagi.");
              });
          }
        }
      });
    }
  
    // Update tugas
    const updateTaskBtn = document.getElementById("updateTaskBtn");
    if (updateTaskBtn) {
      updateTaskBtn.addEventListener("click", function () {
        const taskId = document.getElementById("editTaskId").value;
  
        // Dapatkan nilai dari form
        const title = document.getElementById("editTitle").value;
        const category = document.getElementById("editCategory").value;
        const deadline = document.getElementById("editDeadline").value;
        const status = document.getElementById("editStatus").value;
  
        // Validasi input
        if (!title || !category || !deadline || !status) {
          alert("Semua field harus diisi!");
          return;
        }
  
        // Kirim data ke server
        fetch(`/tasks/${taskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            category,
            deadline,
            status,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Tutup modal
              const modal = bootstrap.Modal.getInstance(document.getElementById("editTaskModal"));
              modal.hide();
  
              // Refresh daftar tugas
              const activeCategory = document.querySelector("#categoryFilter a.active").getAttribute("data-category");
              fetchTasks(activeCategory);
            } else {
              alert(data.message || "Terjadi kesalahan saat mengupdate tugas.");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("Terjadi kesalahan. Silakan coba lagi.");
          });
      });
    }
  });
  
  // Fungsi untuk mengambil tugas berdasarkan kategori
  function fetchTasks(category) {
    let url = "/tasks";
    if (category && category !== "all") {
      url += `?category=${category}`;
    }
  
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update jumlah tugas
          const taskCount = document.getElementById("taskCount");
          taskCount.textContent = `${data.count} Tugas`;
  
          // Update daftar tugas
          renderTasks(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  // Fungsi untuk merender daftar tugas
  function renderTasks(tasks) {
    const taskListContainer = document.getElementById("taskList");
  
    if (tasks.length === 0) {
      taskListContainer.innerHTML = `
          <div class="text-center py-5">
            <i class="fas fa-tasks fs-1 text-muted mb-3"></i>
            <p class="lead">Belum ada tugas. Silakan tambahkan tugas baru.</p>
          </div>
        `;
      return;
    }
  
    let html = `
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Kategori</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
      `;
  
    tasks.forEach((task) => {
      // Format tanggal
      const deadline = new Date(task.deadline);
      const formattedDeadline = deadline.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  
      // Tentukan warna badge berdasarkan kategori
      const categoryClass = task.category === "Kuliah" ? "bg-primary" : task.category === "Organisasi" ? "bg-success" : "bg-info";
  
      // Tentukan warna badge berdasarkan status
      const statusClass = task.status === "Belum Selesai" ? "bg-danger" : task.status === "Sedang Dikerjakan" ? "bg-warning" : "bg-success";
  
      html += `
          <tr data-id="${task._id}">
            <td>${task.title}</td>
            <td>
              <span class="badge ${categoryClass}">
                ${task.category}
              </span>
            </td>
            <td>${formattedDeadline}</td>
            <td>
              <span class="badge ${statusClass}">
                ${task.status}
              </span>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary edit-task" data-bs-toggle="modal" data-bs-target="#editTaskModal" data-id="${task._id}">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-outline-danger delete-task" data-id="${task._id}">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
    });
  
    html += `
            </tbody>
          </table>
        </div>
      `;
  
    taskListContainer.innerHTML = html;
  }
  