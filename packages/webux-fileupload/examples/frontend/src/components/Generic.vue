<template>
  <div id="test" class="container">
    <div class="text-center mx-auto mt-2">
      <h1 class="text-center">Tests</h1>
      <div class="isLoading" v-if="isLoading">
        <Loading />
      </div>
      <p>{{errorMessage}}</p>
      <div class="myContent">
        <div class="shadow p-3 mb-5 bg-white rounded">
          <div class="card">
            <div class="card-body">
              <div class="card-title">File Upload</div>
              <div class="card-text">
                <div>
                  <h1>Submit file with REST API</h1>
                  <div class="align-items-center mb-3 mt-5" id="fileSection">
                    <div class="shadow p-3 mb-3 bg-white rounded">
                      <div class="card">
                        <vue-dropzone
                          ref="myVueDropzone"
                          id="dropzone"
                          :options="dropzoneOptions"
                          @vdropzone-file-added="hasQueuedFile"
                          @vdropzone-removed-file="fileRemoved"
                        ></vue-dropzone>
                      </div>
                    </div>
                  </div>
                  <button v-if="showUploadBtn" @click="Save()">Upload</button>
                </div>
                <hr />
                <div>
                  <h1>Submit file socket.IO</h1>
                  <input type="file" id="siofu_input" ref="upload_input" />
                  <h1>Download</h1>
                  <button @click="download">Download a file</button>
                  <input type="text" name="filename" id="filename" v-model="filename" />
                  <span>{{ message }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading/Page";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { mapGetters } from "vuex";
import { socketIOUpload } from "../plugins/socket";
import SocketIOFileUpload from "socketio-file-upload";
import ss from "socket.io-stream";

export default {
  name: "Generic",
  components: {
    Loading,
    vueDropzone: vue2Dropzone
  },
  data() {
    return {
      filename: "",
      message: "",
      showUploadBtn: false,
      dropzoneOptions: {
        url: "http://127.0.0.1:1340/upload",
        thumbnailWidth: 150,
        maxFilesize: 256,
        addRemoveLinks: true,
        maxFiles: 3,
        autoProcessQueue: false,
        paramName: "file"
      }
    };
  },
  computed: {
    ...mapGetters([
      "isLoading",
      "successMessage",
      "errorMessage",
      "user",
      "profile",
      "errorMessage"
    ])
  },
  methods: {
    Save() {
      console.log(this.$refs.myVueDropzone);
      this.$refs.myVueDropzone.processQueue();
    },
    hasQueuedFile(file) {
      console.log(file);
      console.log(this.$refs.myVueDropzone);
      this.showUploadBtn = true;
    },
    fileRemoved(file, error, xhr) {
      console.log(file);
      console.error(error);
      console.log(xhr);
      console.log(this.$refs.myVueDropzone);
      this.showUploadBtn = false;
    },
    download() {
      if (!this.filename) {
        return;
      }

      this.downloadFile(this.filename, this.filename);
    },
    downloadFile(name, originalFilename) {
      return new Promise((resolve, reject) => {
        let vm = this;
        let stream = ss.createStream();

        let fileBuffer = [],
          fileLength = 0;
        console.log("emit : download");
        ss(socketIOUpload).emit("download", stream, name, function(
          fileInfo,
          fileError
        ) {
          if (fileError) {
            return reject(fileError);
          } else {
            console.log(["File Found!", fileInfo]);

            stream.on("data", function(chunk) {
              fileLength += chunk.length;
              var progress = Math.floor((fileLength / fileInfo.size) * 100);
              progress = Math.max(progress - 2, 1);
              console.log(progress);
              fileBuffer.push(chunk);
            });

            stream.on("end", () => {
              var filedata = new Uint8Array(fileLength),
                i = 0;

              fileBuffer.forEach(function(buff) {
                for (var j = 0; j < buff.length; j++) {
                  filedata[i] = buff[j];
                  i++;
                }
              });

              vm.downloadFileFromBlob([filedata], originalFilename);

              return resolve();
            });
          }
        });
      });
    },
    downloadFileFromBlob(data, fileName) {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      var blob = new Blob(data, {
          type: "octet/stream"
        }),
        url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  },
  mounted() {
    var siofu = new SocketIOFileUpload(socketIOUpload);

    siofu.listenOnInput(this.$refs.upload_input);

    siofu.addEventListener("choose", function(event) {
      console.log(event.files);
    });
    siofu.addEventListener("start", function(event) {
      console.log(event.file);
    });
    siofu.addEventListener("load", function(event) {
      console.log(event.file);
      console.log(event.reader);
      console.log(event.name);
    });
    siofu.addEventListener("error", function(event) {
      console.log(event.file);
      console.log(event.message);
      console.log(event.code);
    });

    // Do something on upload progress:
    siofu.addEventListener("progress", function(event) {
      console.log("progress");
      var percent = (event.bytesLoaded / event.file.size) * 100;
      console.log("File is", percent.toFixed(2), "percent loaded");
    });

    // Do something when a file is uploaded:
    siofu.addEventListener("complete", function(event) {
      console.log("complete");
      console.log(event.success);
      console.log(event.file);
    });
  }
};
</script>
