import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { isNumber } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  logIn(email, password){
    let url = environment.homeAutomationApi + 'api/partner/login'
    return this.http.post(url, {"email": email, "password": password}, {observe: 'response'})
  }
  register(body) {
    let url = environment.homeAutomationApi + 'api/partner'
    return this.http.post(url, body)
  }
  getAllDevices(params){
    let url = environment.homeAutomationApi + 'api/device';
    if(isNumber(params.limit) && isNumber(params.offset)){
      url += '&limit=' + params.limit + '&offset=' + params.offset;
    }
    // url += '&limit=' + params.limit + '&offset=' + params.offset;
    return this.http.get(url)
  }

  updateDevice(deviceId, updateBody){
    let url = environment.homeAutomationApi + 'api/device/' + deviceId;
    return this.http.put(url, updateBody)
  }

  deleteDevice(deviceId){
    let url = environment.homeAutomationApi + 'api/device/' + deviceId;
    return this.http.delete(url)
  }

  addNewDevice(newDeviceBody){
    let url = environment.homeAutomationApi + 'api/device/';
    return this.http.post(url, newDeviceBody)
  }

  postComment(body){
    let url = environment.homeAutomationApi + 'comment'
    return this.http.post(url, body)
  }
  editComment(body){
    let url = environment.homeAutomationApi + 'comment'
    return this.http.put(url, body)
  }
}
