<template>
  <div class="container py-4">
    <h3>Upload Medical Documents</h3>

    <div v-if="uploadStatus" :class="`alert alert-${uploadStatus.type} mt-3`">
      {{ uploadStatus.message }}
    </div>

    <form @submit.prevent="handleUpload" class="mt-3">
      <div class="mb-3">
        <label class="form-label">Select File (PDF/Image)</label>
        <input
          ref="fileInput"
          type="file"
          class="form-control"
          accept=".pdf,image/*"
          @change="handleFileChange"
        />
      </div>

      <div v-if="preview && isImage" class="mb-3">
        <p>Preview:</p>
        <img :src="preview" class="img-thumbnail" style="max-width: 200px" />
      </div>

      <button 
        class="btn btn-primary" 
        :disabled="!file || uploading"
        type="submit"
      >
        <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
        {{ uploading ? 'Uploading...' : 'Upload' }}
      </button>
    </form>

    <div v-if="uploadedFiles.length > 0" class="mt-5">
      <h5>Uploaded Files</h5>
      <ul class="list-group">
        <li
          class="list-group-item d-flex justify-content-between align-items-center"
          v-for="(f, idx) in uploadedFiles"
          :key="idx"
        >
          <span>{{ f.name }}</span>
          <span class="badge bg-secondary">{{ f.type }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      preview: null,
      uploadedFiles: [],
      uploading: false,
      uploadStatus: null,
    };
  },
  computed: {
    isImage() {
      return this.file && this.file.type.startsWith('image/');
    },
  },
  methods: {
    handleFileChange(event) {
      const selected = event.target.files[0];
      this.file = selected;
      if (this.isImage) {
        this.preview = URL.createObjectURL(selected);
      } else {
        this.preview = null;
      }
    },
    async handleUpload() {
      if (!this.file) return;

      this.uploading = true;
      this.uploadStatus = null;

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('patientId', this.$store.state.auth.currentUser.id); // Associate with current patient

        // In a real implementation, you would send this to your backend API
        // For now, we'll simulate the upload with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate successful upload response
        const response = {
          data: {
            success: true,
            fileName: this.file.name,
            fileType: this.file.type,
            uploadedAt: new Date().toISOString()
          }
        };

        // Add to uploaded files list
        this.uploadedFiles.push({
          name: response.data.fileName,
          type: response.data.fileType,
          uploadedAt: response.data.uploadedAt
        });

        // Show success message
        this.uploadStatus = {
          type: 'success',
          message: 'File uploaded successfully!'
        };

        // Reset form
        this.file = null;
        this.preview = null;
        this.$refs.fileInput.value = '';
      } catch (error) {
        // Handle upload error
        this.uploadStatus = {
          type: 'danger',
          message: 'Upload failed: ' + (error.response?.data?.message || error.message || 'Unknown error')
        };
      } finally {
        this.uploading = false;
      }
    },
  },
};
</script>
