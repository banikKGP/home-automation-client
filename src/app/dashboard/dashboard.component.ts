import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  devices: any;
  newComment: string;
  user: any;
  totalDeviceCount: any;
  currentDeviceCount: any;
  allowedDevices: Array<String> = [];
  allowedDevicesIconMap: Map<String, String> = new Map()
  modalRef: BsModalRef

  newDeviceName: String;
  newDeviceLocation: String;
  newDeviceType: String;
  editedDevice: any;

  constructor(private toastr: ToastrService,
    private appService: AppService,
    private router: Router,
    private modalService: BsModalService) {
    this.allowedDevicesIconMap.set("LIGHT", "fa-lightbulb-o")
    this.allowedDevicesIconMap.set("PLUG", "fa-plug")
    this.allowedDevicesIconMap.set("TV", "fa-television")
    this.allowedDevicesIconMap.set("HEADPHONE", "fa-headphones")
    this.allowedDevices.push(...this.allowedDevicesIconMap.keys());
  }

  ngOnInit(): void {

    this.user = JSON.parse(localStorage.getItem('userDetail'))
    if (!this.user) {
      this.router.navigateByUrl('/')
    }
    let params = {};
    this.appService.getAllDevices(params).subscribe(
      (devices: any) => {
        devices = devices.data;
        this.totalDeviceCount = devices.totalCount;
        this.currentDeviceCount = devices.currentCount;
        this.devices = devices.activeDevices
        this.devices.forEach(device => {
          device.icon = "fa " + this.allowedDevicesIconMap.get(device.deviceType)
        });
      }
    )
    this.resetNewDeviceData();
  }

  logout() {
    localStorage.removeItem('userDetail')
    localStorage.removeItem('partnerToken')
    this.router.navigateByUrl('/')
  }

  toggleDeviceConnection(device) {
    device.isTurnOn = !device.isTurnOn
    this.appService.updateDevice(device.deviceId, { isTurnOn: device.isTurnOn }).subscribe(
      () => {
        console.log('Successfully updated device')
      });
  }

  openAddDeviceModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
    // this.allowedDevices.keys()
  }

  openSettingModal(template: TemplateRef<any>, device) {
    this.modalRef = this.modalService.show(template);
    this.editedDevice = {...device};
    // this.allowedDevices.keys()
  }

  resetNewDeviceData() {
    this.newDeviceName = "";
    this.newDeviceLocation = "";
    this.newDeviceType = "";
  }

  addNewDevice() {
    let newDevice = {
      "deviceName": this.newDeviceName,
      "deviceType": this.newDeviceType,
      "location": this.newDeviceLocation
    }
    this.appService.addNewDevice(newDevice).subscribe(
      (newDevice: any) => {
        newDevice = newDevice.data;
        this.toastr.success("Successfully added device")
        newDevice.icon = "fa " + this.allowedDevicesIconMap.get(newDevice.deviceType)
        this.devices.push(newDevice)
        this.modalRef.hide()
        this.resetNewDeviceData()
      },
      (err) => {
        err = err.error
        this.toastr.error(err.message || 'Some error occured, please try after some time')
      })
  }

  editDevice() {
    let deviceBody = {
      "deviceName": this.editedDevice.deviceName,
      "location": this.editedDevice.location
    }
    this.appService.updateDevice(this.editedDevice.deviceId, deviceBody).subscribe(
      (newDevice: any) => {
        newDevice = newDevice.data;
        this.toastr.success("Successfully updated device")
        newDevice.icon = "fa " + this.allowedDevicesIconMap.get(newDevice.deviceType)
        for(let i=0; i<this.devices.length; i++){
          let device = this.devices[i];
          if(device.deviceId === this.editedDevice.deviceId){
            this.devices[i] = newDevice
            break
          }
        }
        this.modalRef.hide()
      },
      (err) => {
        err = err.error
        this.toastr.error(err.message || 'Some error occured, please try after some time')
      })
  }

  removeDevice(){
    this.appService.deleteDevice(this.editedDevice.deviceId).subscribe(
      () => {
        this.toastr.success("Successfully deleted device")
        let idx = -1
        for(let i=0; i<this.devices.length; i++){
          let device = this.devices[i];
          if(device.deviceId === this.editedDevice.deviceId){
            idx = i
            break
          }
        }
        if(idx > -1){
          this.devices.splice(idx, 1  )
        }
        this.modalRef.hide()
      },
      (err) => {
        err = err.error
        this.toastr.error(err.message || 'Some error occured, please try after some time')
      })
  }
}
