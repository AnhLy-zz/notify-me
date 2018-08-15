import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../shared';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'request', loadChildren: './charts/charts.module#ChartsModule' },
            { path: 'available', loadChildren: './tables/tables.module#TablesModule' },
            { path: 'detail/:id', loadChildren: './bs-element/bs-element.module#BsElementModule'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
