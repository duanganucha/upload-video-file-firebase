import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//////
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import firebase from 'firebase'
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Platform } from 'ionic-angular';

//////
declare var window: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  constructor(
    public navCtrl: NavController,
    private fileChooser: FileChooser,
    private file: File,
    private camera: Camera,
    private filePath: FilePath,
    public platform: Platform) {
  }

  chooseVideo(){
    if(this.platform.is('ios')){
      this.chooseIOS();
    }else if(this.platform.is('android')){
      this.chooseAndroid();
    }
  }

  //////////// Android
  chooseAndroid() {
    this.fileChooser.open().then((uri) => {
      alert(uri);

      this.filePath.resolveNativePath(uri).then(filePath => {
        alert(filePath);
        let dirPathSegments = filePath.split('/');
        let fileName = dirPathSegments[dirPathSegments.length - 1];
        dirPathSegments.pop();
        let dirPath = dirPathSegments.join('/');
        this.file.readAsArrayBuffer(dirPath, fileName).then(async (buffer) => {
          await this.upload(buffer, fileName);
        }).catch((err) => {
          alert(err.toString());
        });
      });
    });
  }


  async upload(buffer, name) {//////

    let blob = new Blob([buffer], { type: "video/mp4" })
    let storage = firebase.storage();

    storage.ref('videos/' + name).put(blob).then((d) => {
      alert('เรียบร้อย');
    }).catch((error) => {
      alert(JSON.stringify(error))
      alert("can not upload");
    })
  }


  ///////////////////// IOS apple
  chooseIOS() {

    const cameraOptions: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      // encodingType: this.camera.EncodingType,
      mediaType: this.camera.MediaType.VIDEO

    }
    this.camera.getPicture(cameraOptions)
    .then((_imagePath) => {

       alert('got image path ' + _imagePath);
      // convert picture to blob
      return this.makeFileIntoBlob(_imagePath);
    }).then((_imageBlob)=>{
      alert('got image blob ' + _imageBlob);
    // upload the blob
      return this.uploadToFirebase(_imageBlob);
     }).then((_uploadSnapshot: any) => {
      alert('file uploaded successfully  ' + _uploadSnapshot.downloadURL);
      // store reference to storage in database  
    }, (_error) => {
      alert('Error ' + (_error.message || _error));
    });
  
  
  }
  makeFileIntoBlob(_imagePath) {

    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {
  
        fileEntry.file((resFile) => {
  
          var reader = new FileReader();
          reader.onloadend = (evt: any) => {
            var imgBlob: any = new Blob([evt.target.result], { type: 'video/mp4' });
            imgBlob.name = 'sample.jpg';
            resolve(imgBlob);
          };
  
          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };
  
          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }
  uploadToFirebase(_imageBlob) {
    var fileName = 'VID-' + new Date().getTime() + '.mp4';
  
    return new Promise((resolve, reject) => {
      var fileRef = firebase.storage().ref('videos/' + fileName);
  
      var uploadTask = fileRef.put(_imageBlob);
  
      uploadTask.on('state_changed', (_snapshot) => {
        console.log('snapshot progess ' + _snapshot);
      }, (_error) => {
        reject(_error);
      }, () => {
        // completion...
        resolve(uploadTask.snapshot);
      });
    });
  }

}
