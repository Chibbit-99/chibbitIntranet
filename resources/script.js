// Example JS for Chibbit Intranet homepage

document.addEventListener("DOMContentLoaded", () => {
    const fileItems = document.getElementById("fileItems");
    const refreshBtn = document.getElementById("refreshBtn");

    // Example static files (replace with actual fetch logic later)
    const files = [
        "index.html",
        "about.html",
        "test.html",
        "readme.txt"
    ];

    function populateFiles() {
        fileItems.innerHTML = "";
        files.forEach(file => {
            const li = document.createElement("li");
            li.textContent = file;
            fileItems.appendChild(li);
        });
    }

    refreshBtn.addEventListener("click", () => {
        // TODO: Implement actual file fetch from WSS server
        alert("Refreshing files... (not implemented)");
        populateFiles();
    });

    populateFiles();
});
