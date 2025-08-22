// MyUploadAdapter.ts
class MyUploadAdapter {
  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file: File) => new Promise((resolve, reject) => {
      const data = new FormData();
      data.append('upload', file); // Phải khớp với @RequestParam("upload") ở backend

      fetch('http://localhost:8080/api/upload/description', {
        method: 'POST',
        body: data,
      })
        .then(response => response.json())
        .then(data => {
          if (data.uploaded) {
            resolve({ default: data.url }); // Trả về URL để CKEditor chèn vào editor
          } else {
            reject(data.error?.message || 'Upload failed');
          }
        })
        .catch(error => reject(`Upload failed: ${error.message}`));
    }));
  }

  abort() {
    // Có thể thêm logic abort nếu cần (không bắt buộc)
  }
}

export default MyUploadAdapter; // Thêm dòng này để export default