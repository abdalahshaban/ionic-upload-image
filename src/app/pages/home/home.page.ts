import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { pipe, BehaviorSubject } from 'rxjs';
import { map, filter, tap, last, delay } from 'rxjs/operators';
import { HttpEvent, HttpEventType, HttpResponse, HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public downloadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  imageUpload: FormGroup;

  formData = new FormData();
  files: Array<File> = []
  progress = 0
  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.imageUpload = new FormGroup({
      logo: new FormControl(null, [Validators.required]),
      cover: new FormControl(null, [Validators.required]),

    });
  }


  selectedFile(event) {
    // console.log(event.target.files[0]);
    this.files.push(event.target.files[0])
    console.log(this.files);
  }


  url = `https://e366d5ac.ngrok.io/api/place/upload-main-img/5e1c58bde20d8246b0f8be86`
  headersOtion: HttpHeaders = new HttpHeaders();
  submit() {
    console.log(this.imageUpload.value);
    // this.formData.append('logo', this.imageUpload.value.logo.replace("C:\\fakepath\\", ""));
    // this.formData.append('cover', this.imageUpload.value.cover.replace("C:\\fakepath\\", ""));

    this.formData.append('logo', this.files[0], this.files[0].name);
    this.formData.append('cover', this.files[1], this.files[1].name);

    // this.headersOtion = this.eadersOtion.append('Content-Type', 'application/json');
    this.headersOtion = this.headersOtion.append('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cm4iOjQ4ODMyMDEzOCwiZXhwIjoxNTgxMzIxMzQ0MDAwMDAwLCJpYXQiOjE1ODEyMzQ5NDQwMDAwMDAsIl9pZCI6IjVlMjQ0ZjNjN2NjYTcyMzcxODhlMGJmMiIsInJvbGUiOiJhZG1pbiJ9.x0qdEFrGKrk0tmEr40kURbCR5TuD1ly6ZPx4LCdbMaY')

    this.http.post(this.url, this.formData, {
      headers: this.headersOtion,
      reportProgress: true,
      observe: 'events'
    }).pipe(delay(2000)).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        console.log(event.type);
        let status = Math.round(100 * event.loaded / event.total);
        this.uploadProgress.next(status);
      }
      if (event.type === HttpEventType.Response) {
        console.log(event);
        this.imageUpload.reset();
      }

    });


  }



  requiredFileType(type: string) {
    console.log(type);
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.')[1].toLowerCase();
        if (type.toLowerCase() !== extension.toLowerCase()) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }

      return null;
    };
  }

  toFormData<T>(formValue: T) {
    const formData = new FormData();

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }

    return formData;
  }

  toResponseBody<T>() {
    return pipe(
      filter((event: HttpEvent<T>) => event.type === HttpEventType.Response),
      map((res: HttpResponse<T>) => res.body)
    );
  }

  // uploadProgress<T>(cb: (progress: number) => void) {
  //   return tap((event: HttpEvent<T>) => {
  //     if (event.type === HttpEventType.UploadProgress) {
  //       cb(Math.round((100 * event.loaded) / event.total));
  //     }
  //   });

  // }


  getStatusMessage(event) {
    console.log(event, 'event in fun');
    let status;

    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading Files`;

      case HttpEventType.UploadProgress:
        status = Math.round(100 * event.loaded / event.total);
        this.uploadProgress.next(status);
        return `Files are ${status}% uploaded`;

      case HttpEventType.DownloadProgress:
        status = Math.round(100 * event.loaded / event.total);
        this.downloadProgress.next(status); // NOTE: The Content-Length header must be set on the server to calculate this
        return `Files are ${status}% downloaded`;

      case HttpEventType.Response:
        return `Done`;

      default:
        return `Something went wrong`
    }
  }

  resetProgress() {
    this.uploadProgress.next(0);
    this.downloadProgress.next(0);
  }
}
