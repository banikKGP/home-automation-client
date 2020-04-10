import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ModalModule.forRoot()
  ]
})
export class DashboardModule { }
