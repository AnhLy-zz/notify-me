import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    public model: any = {
        username: '',
        password: ''
    }
    notification: string
    constructor(public router: Router) {}

    ngOnInit() {}

    onLoggedin() {
        if ((this.model.username === 'showroomq7' 
        || this.model.username === 'showroomq10'
        || this.model.username === 'showroomqbt') && this.model.password === 'usofa.vn') {
            localStorage.setItem('isLoggedin', 'true');
            localStorage.setItem('username', this.model.username);
            this.router.navigate(['/calculate'], {replaceUrl: true});
        } else {
            localStorage.setItem('isLoggedin', 'false');
            this.notification = "Username or Password is incorrect!!!"
            setTimeout(() => { this.notification = null; }, 2500);
        }
    }

    handleKeyDown(event: any) {
        if (event.keyCode === 13) {
            this.onLoggedin()
        }
    }
}
