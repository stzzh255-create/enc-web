async function processFile(mode) {
    const fileInput = document.getElementById('fileInput');
    const password = document.getElementById('password').value;
    const status = document.getElementById('status');
    const downloadLink = document.getElementById('downloadLink');

    if (!fileInput.files[0] || !password) {
        alert("Pilih file dan masukkan password!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    status.innerText = "Sedang memproses... Mohon tunggu.";

    reader.onload = function(e) {
        const data = e.target.result;
        let processedData;

        try {
            if (mode === 'encrypt') {
                processedData = CryptoJS.AES.encrypt(data, password).toString();
                saveBlob(processedData, file.name + ".enc");
            } else {
                const bytes = CryptoJS.AES.decrypt(data, password);
                processedData = bytes.toString(CryptoJS.enc.Utf8);
                
                if (!processedData) throw new Error();
                saveBlob(processedData, file.name.replace(".enc", ""));
            }
            status.innerText = "Selesai!";
        } catch (err) {
            status.innerText = "Gagal! Password salah atau file rusak.";
        }
    };

    if (mode === 'encrypt') {
        reader.readAsDataURL(file); // Untuk file umum
    } else {
        reader.readAsText(file); // Untuk file .enc
    }
}

function saveBlob(content, fileName) {
    const link = document.getElementById('downloadLink');
    const file = new Blob([content], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.style.display = 'block';
    link.innerText = "Klik di sini untuk mengunduh: " + fileName;
}