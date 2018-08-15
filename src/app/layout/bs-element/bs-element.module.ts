import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsElementRoutingModule } from './bs-element-routing.module';
import { BsElementComponent } from './bs-element.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [CommonModule, BsElementRoutingModule, PageHeaderModule, FormsModule],
    declarations: [BsElementComponent]
})
export class BsElementModule {}
